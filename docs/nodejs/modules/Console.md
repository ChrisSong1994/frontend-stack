# Console 模块

### **Node.js 中的 Console 模块详解**

Node.js 的 `console` 模块是用于输出日志、调试信息及错误的核心工具，与浏览器中的 `console` 类似，但具备一些针对服务器环境的增强功能。以下是该模块的详细解析：

### **1. 基本使用**
无需显式引入，`console` 是 Node.js 的全局对象，直接调用其方法即可：
```javascript
console.log('Hello Node.js'); // 标准输出
console.error('Error occurred'); // 错误输出（默认到 stderr）
```

### **2. 核心方法**

#### **2.1 基础日志输出**
| **方法**                | **说明**                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `console.log([data][, ...args])`   | 输出普通日志（stdout）。                                              |
| `console.info([data][, ...args])`  | 同 `console.log`，语义化标识“信息”。                                  |
| `console.warn([data][, ...args])`  | 输出警告日志（默认到 stderr）。                                       |
| `console.error([data][, ...args])` | 输出错误日志（stderr）。                                              |

**示例**：
```javascript
console.log('User %s logged in', 'Alice'); // 格式化输出：User Alice logged in
console.error(new Error('404 Not Found')); // 输出完整错误堆栈
```

#### **2.2 高级调试方法**
| **方法**                          | **说明**                                                                 |
|-----------------------------------|-------------------------------------------------------------------------|
| `console.time(label)`             | 启动计时器（同一 `label` 标识）。                                      |
| `console.timeEnd(label)`          | 停止计时器并输出耗时（单位：毫秒）。                                   |
| `console.trace([message][, ...args])` | 输出当前代码位置的堆栈跟踪。                                          |
| `console.assert(value[, ...message])` | 断言：若 `value` 为假值，则输出错误消息（不中断程序）。               |
| `console.clear()`                 | 清空控制台（终端环境可能不支持）。                                     |

**示例**：
```javascript
console.time('fetchData');
await fetchData(); // 模拟耗时操作
console.timeEnd('fetchData'); // 输出：fetchData: 250ms

console.trace('Current stack trace'); // 打印调用堆栈
console.assert(1 === 2, '1 is not equal to 2'); // 输出断言错误
```

#### **2.3 结构化数据输出**
| **方法**                     | **说明**                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| `console.dir(obj[, options])` | 以可读格式打印对象（类似 `util.inspect`）。                            |
| `console.table(array)`        | 将数组或对象以表格形式输出（适合结构化数据展示）。                     |

**示例**：
```javascript
const user = { name: 'Bob', age: 30, roles: ['admin', 'user'] };
console.dir(user, { colors: true, depth: 2 }); // 彩色输出，展开两层属性

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
console.table(users); // 表格化展示数据
```

### **3. 自定义 Console 实例**
通过 `new Console(options)` 创建独立的日志实例，可指定输出目标（如文件流）：
```javascript
const fs = require('fs');
const { Console } = require('console');

// 将 stdout 和 stderr 输出到文件
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
const logger = new Console({ stdout: output, stderr: errorOutput });

logger.log('This will be written to stdout.log');
logger.error('This will go to stderr.log');
```

**参数选项**：
- `stdout`: 标准输出流（默认 `process.stdout`）。
- `stderr`: 错误输出流（默认 `process.stderr`）。
- `ignoreErrors`: 写入流时忽略错误（默认 `true`）。
- `colorMode`: 是否支持 ANSI 颜色（`true` / `false` / 'auto'）。

### **4. 格式化输出**
支持类似 `util.format()` 的占位符：
| **占位符** | **说明**                         |
|------------|---------------------------------|
| `%s`       | 字符串（自动转换非字符串类型）。 |
| `%d` / `%i` | 整数（自动过滤非数字）。        |
| `%f`       | 浮点数。                        |
| `%j`       | JSON 字符串（自动序列化对象）。 |
| `%o` / `%O` | 对象（类似 `util.inspect`）。   |
| `%%`       | 输出百分号 `%`。                |

**示例**：
```javascript
console.log(
  'User: %s, Age: %d, Metadata: %j',
  'Alice',
  25,
  { role: 'admin' }
);
// 输出：User: Alice, Age: 25, Metadata: {"role":"admin"}
```

### **5. 同步与异步输出**
- **同步模式**  
  当输出目标为 **文件** 或 **TTY（终端）** 时，日志写入是同步的，确保消息顺序和完整性（即使进程崩溃，日志不会丢失）。
  
- **异步模式**  
  当输出目标为 **管道（pipe）** 或 **非 TTY 文件描述符** 时，写入是异步的（更高性能，但可能丢失崩溃前的最后几条日志）。

### **6. 与浏览器 Console 的差异**
| **特性**           | **Node.js Console**                     | **浏览器 Console**                   |
|--------------------|----------------------------------------|--------------------------------------|
| **输出目标**       | 可自定义为任意流（文件、网络等）。     | 固定为浏览器开发者工具控制台。       |
| **格式化方法**     | 使用 `util.format` 风格占位符。        | 支持 CSS 样式（如 `%c`）。           |
| **异步/同步**      | 根据输出目标动态切换。                 | 始终异步。                           |
| **扩展方法**       | 支持 `console.table`、`console.dir`。  | 支持 `console.group`、`console.profile`。 |

### **7. 最佳实践**
1. **生产环境日志管理**  
   - 使用 `winston` 或 `pino` 等库替代原生 `console`，支持日志分级、轮转和传输。
   - 避免高频日志输出，防止 I/O 阻塞。

2. **调试技巧**  
   ```javascript
   // 动态控制调试输出
   const DEBUG = process.env.DEBUG === 'true';
   DEBUG && console.log('Debug info:', data);
   ```

3. **错误日志标准化**  
   ```javascript
   console.error(`[${new Date().toISOString()}] ERROR: ${error.message}`);
   ```

### **8. 示例：自定义日志实例**
```javascript
const { Console } = require('console');
const fs = require('fs');

// 创建带时间戳的日志实例
const logger = new Console({
  stdout: fs.createWriteStream('./app.log'),
  stderr: fs.createWriteStream('./errors.log'),
  inspectOptions: { depth: 2, colors: false }
});

logger.log('[INFO] Server started at %s', new Date());
logger.error('[ERROR] Database connection failed');
```

### **9. 总结**
Node.js 的 `console` 模块是开发调试和日志记录的基础工具，通过灵活的输出配置和丰富的格式化选项，能满足从简单日志到复杂调试的需求。结合第三方日志库和合理的日志策略，可进一步提升应用的可维护性和可靠性。