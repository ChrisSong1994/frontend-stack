# Errors

Node.js 的 `Errors` 模块是处理应用程序运行时错误的核心机制，涵盖了从标准 JavaScript 错误到系统级错误的多种类型。以下是其详细介绍及示例用法：

### **一、错误分类**
Node.js 错误主要分为四类：
1. **标准 JavaScript 错误**：如 `SyntaxError`（语法错误）、`TypeError`（类型错误）等。
2. **系统错误**：由操作系统触发，例如文件不存在或网络连接中断。
3. **用户自定义错误**：开发者通过 `throw new Error()` 主动抛出的错误。
4. **断言错误**（`AssertionError`）：由 `assert` 模块检测到逻辑异常时触发。

所有错误均继承自 JavaScript 的 `Error` 类，提供 `message` 和 `stack` 等基础属性。

### **二、同步错误处理**
#### **示例 1：`try/catch` 捕获同步错误**
```javascript
try {
  console.log(nonExistentVariable); // 访问未定义变量
} catch (err) {
  console.error("捕获同步错误:", err.message); // 输出：'nonExistentVariable is not defined'
}
```
此方法适用于同步代码中的异常，如变量未定义或类型错误。

### **三、异步错误处理**
#### **示例 2：错误优先回调（Error-First Callbacks）**
```javascript
const fs = require('fs');
fs.readFile('不存在的文件.txt', (err, data) => {
  if (err) {
    console.error("系统错误:", err.message); // 如 ENOENT（文件不存在）
    return;
  }
  console.log(data);
});
```
Node.js 核心异步 API 普遍采用此模式，首个参数为错误对象。

#### **示例 3：Promise 和 async/await**
```javascript
// Promise 方式
const fs = require('fs').promises;
fs.readFile('不存在的文件.txt')
  .then(data => console.log(data))
  .catch(err => console.error("Promise 错误:", err.message));

// async/await 方式
async function readFile() {
  try {
    const data = await fs.readFile('不存在的文件.txt');
  } catch (err) {
    console.error("Async 错误:", err.message);
  }
}
```
通过 `.catch()` 或 `try/catch` 捕获异步操作错误，适用于现代异步代码。

### **四、错误中间件（Express 框架）**
#### **示例 4：全局错误处理**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  throw new Error('自定义错误');
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('服务器内部错误');
});

app.listen(3000);
```
通过中间件统一处理路由中抛出的错误，避免进程崩溃。

### **五、自定义错误类**
#### **示例 5：扩展 Error 类**
```javascript
class CustomError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}

// 使用示例
app.get('/error', (req, res, next) => {
  next(new CustomError('参数无效', 400));
});

// 错误处理中间件中针对性响应
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  next(err);
});
```
自定义错误可增强错误分类和响应控制。

### **六、系统错误码与处理**
Node.js 定义了丰富的系统错误码（如 `ECONNABORTED`、`ENOENT`），可通过 `err.code` 判断类型：
```javascript
req.on('error', (err) => {
  if (err.code === 'ECONNABORTED') {
    console.log('连接中止错误');
  }
});
```
此类错误通常由网络或文件系统操作触发。

### **总结**
Node.js 的错误处理需结合同步/异步场景选择合适的机制：
• **同步代码**：`try/catch`。
• **回调函数**：错误优先模式。
• **现代异步**：Promise 链式调用或 `async/await`。
• **框架集成**：中间件统一拦截。
• **复杂场景**：自定义错误类分类处理。

通过合理运用这些机制，可以显著提升应用的健壮性和可维护性。