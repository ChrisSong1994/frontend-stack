# OS 操作系统
Node.js 提供了一个强大的 `os` 模块，允许开发者访问和操作底层操作系统功能。通过 `os` 模块，可以获取系统信息、环境变量、CPU时间以及其他与操作系统相关的实用工具。以下是 `os` 模块的核心功能及其详细说明，并附有示例代码。

### 1. **核心功能**

#### a. **获取操作系统信息**
- `os.platform()`: 返回当前操作系统的名称，如 'linux'、'darwin'（macOS）、'win32' 等。
- `os.arch()`: 返回处理器架构，如 'x64' 或 'arm'。
- `os.hostname()`: 返回主机名。
- `os.type()`: 返回操作系统类型，如 'Linux', 'Darwin' 等。
- `os.release()`: 返回操作系统的发行版本。

**示例代码**:

```javascript
const os = require('os');

console.log('操作系统平台:', os.platform());      // 输出: 操作系统平台: linux/darwin/win32 等
console.log('处理器架构:', os.arch());            // 输出: 处理器架构: x64/arm 等
console.log('主机名:', os.hostname());            // 输出: 主机名: 本地计算机的主机名
console.log('操作系统类型:', os.type());          // 输出: 操作系统类型: Linux/Darwin 等
console.log('操作系统版本:', os.release());        // 输出: 操作系统版本: 如 18.04/10.15 等
```

#### b. **获取系统负载信息**
- `os.loadavg()`: 返回系统负载平均值，通常包括三个数值：过去1分钟、5分钟和15分钟的平均负载。
- `os.cpus()`: 返回所有CPU的信息数组，每个对象包含CPU的详细信息。

**示例代码**:

```javascript
const os = require('os');

console.log('系统负载:', os.loadavg());       // 输出: 系统负载: [当前1分钟负载, 当前5分钟负载, 当前15分钟负载]
console.log('CPU 信息:', os.cpus());          // 输出: CPU 信息数组，每个对象包含 CPU 的详细信息
```

#### c. **获取网络接口信息**
- `os.networkInterfaces()`: 返回所有网络接口的详细信息，包括IPv4和IPv6地址。

**示例代码**:

```javascript
const os = require('os');

console.log('网络接口信息:', os.networkInterfaces()); // 输出: 网络接口信息对象，包含每个接口的 IPv4 和 IPv6 地址
```

#### d. **获取环境变量**
- `os.env`: 类似于 `process.env`，返回当前进程的环境变量。

**示例代码**:

```javascript
const os = require('os');

console.log('PATH 环境变量:', os.env.PATH);         // 输出: PATH 环境变量的值
console.log('NODE_ENV 环境变量:', os.env.NODE_ENV);  // 输出: NODE_ENV 环境变量的值，如 development/production
```

#### e. **获取uptime**
- `os.uptime()`: 返回系统自启动以来的时间（秒数）。

**示例代码**:

```javascript
const os = require('os');

console.log('系统运行时间:', os.uptime(), '秒'); // 输出: 系统运行时间，以秒为单位
```

### 2. **高级功能**

#### a. **设置信号处理函数**
Node.js 允许通过 `os.setSignalHandler` 方法来设置自定义的信号处理函数。

**示例代码**:

```javascript
const os = require('os');

// 定义信号处理函数
function signalHandler(sig) {
    console.log(`收到信号: ${sig}`);
    process.exit(0);
}

// 设置 SIGINT（中断信号）处理函数
os.setSignalHandler('SIGINT', signalHandler);

console.log('按下 Ctrl+C 以测试信号处理');
process.stdin.resume();
```

#### b. **获取和设置环境变量**
虽然 `os.env` 主要用于读取环境变量，但 Node.js 还提供了 `os.setEnv` 方法来设置环境变量。

**示例代码**:

```javascript
const os = require('os');

// 设置一个自定义环境变量
os.setEnv('MY_ENV_VAR', 'test-value');

// 读取刚刚设置的环境变量
console.log('MY_ENV_VAR:', os.env.MY_ENV_VAR); // 输出: MY_ENV_VAR: test-value
```

### 3. **应用场景**

#### a. **系统监控**
通过 `os.loadavg()` 和 `os.cpus()`，可以获取系统的负载和CPU使用情况，用于性能监控。

**示例代码**:

```javascript
const os = require('os');
const { default: createCanvas } = require('canvas');

function updateSystemMetrics() {
    console.clear();
    console.log(`系统负载: ${os.loadavg()}`);
    console.log(`CPU 使用率: ${os.cpus()[0].usage}%`);
}

setInterval(updateSystemMetrics, 1000);
```

#### b. **日志文件路径设置**
可以根据操作系统信息动态设置日志文件的存储位置。

**示例代码**:

```javascript
const os = require('os');
const path = require('path');

const logDir = path.join(os.homedir(), 'logs');
const logFile = path.join(logDir, `app.${os.platform()}-${os.arch()}.log`);

console.log(`日志文件路径: ${logFile}`); // 输出: 日志文件路径，根据平台和架构不同而变化
```

#### c. **环境变量管理**
在跨平台开发中，使用 `os.env` 可以统一处理不同的环境变量。

**示例代码**:

```javascript
const os = require('os');

if (os.platform() === 'win32') {
    console.log(`检测到 Windows 操作系统，设置相应配置`);
} else if (os.platform() === 'linux') {
    console.log(`检测到 Linux 操作系统，设置相应配置`);
}
```

### 4. **总结**

Node.js 的 `os` 模块提供了丰富的操作系统相关信息和功能，可以用于：

- 获取平台、架构和版本信息
- 监控系统负载和CPU使用情况
- 处理环境变量
- 设置自定义的信号处理函数
- 动态配置路径和资源管理

合理利用这些功能，可以让程序在不同的操作系统上更好地运行，并优化性能和用户体验。