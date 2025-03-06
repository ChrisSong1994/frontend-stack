# Cluster 模块

以下是关于 Node.js 中 **Cluster 模块**的详细介绍，涵盖其核心功能、使用场景、实现原理及代码示例：

### **1. Cluster 模块的作用**
Node.js 默认是单线程运行的，无法充分利用多核 CPU 的性能。**Cluster 模块**允许通过创建多个子进程（Worker）共享同一个端口，将请求分发到不同的进程处理，从而：
- **提升吞吐量**：利用多核 CPU 并行处理请求。
- **增强稳定性**：某个 Worker 崩溃时，主进程（Master）可自动重启新进程。
- **实现零停机更新**：逐步重启 Worker，保持服务持续可用。

### **2. 核心概念**
| **角色**      | **说明**                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Master 进程** | 负责创建和管理 Worker 进程，通常只运行一次（如 `cluster.isMaster`）。 |
| **Worker 进程** | 实际处理请求的子进程，由 Master 通过 `fork()` 生成，共享同一端口。    |

### **3. 基本使用流程**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// 判断当前进程是否是 Master
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // 根据 CPU 核心数创建 Worker
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 监听 Worker 退出事件并自动重启
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // Worker 进程启动 HTTP 服务
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from Worker ' + process.pid);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

### **4. 关键 API 与方法**
#### **4.1 Master 进程方法**
- **`cluster.fork([env])`**  
  创建新的 Worker 进程，返回 `Worker` 对象。
- **`cluster.settings`**  
  配置参数，如 `exec`（入口文件）、`args`（参数）、`silent`（是否禁止输出日志）等。

#### **4.2 事件监听**
- **`cluster.on('fork', worker => { ... })`**  
  Worker 被创建时触发。
- **`cluster.on('exit', (worker, code, signal) => { ... })`**  
  Worker 退出时触发。
- **`cluster.on('listening', (worker, address) => { ... })`**  
  Worker 开始监听端口时触发。

#### **4.3 Worker 对象属性**
- **`worker.id`**：Worker 的唯一标识。
- **`worker.process`**：子进程对象（`ChildProcess`）。
- **`worker.send(message)`**：向 Worker 发送消息（需结合 IPC 通信）。

### **5. 负载均衡策略**
默认情况下，Cluster 模块使用**轮询（Round-Robin）算法**分发请求（Windows 除外）。可通过 `cluster.schedulingPolicy` 修改策略：
```javascript
// 设置为操作系统调度（由操作系统决定分发）
cluster.schedulingPolicy = cluster.SCHED_NONE;

// 或强制使用轮询（仅 Linux/macOS 有效）
cluster.schedulingPolicy = cluster.SCHED_RR;
```

### **6. 进程间通信（IPC）**
Master 与 Worker 之间可通过 `process.send()` 和 `message` 事件通信：
```javascript
// Master 向 Worker 发送消息
worker.send({ cmd: 'update', data: 'new_config' });

// Worker 接收消息
process.on('message', (msg) => {
  if (msg.cmd === 'update') {
    applyNewConfig(msg.data);
  }
});
```

### **7. 实际应用场景**
#### **7.1 高性能 Web 服务器**
结合 Express、Koa 等框架，每个 Worker 实例化一个服务：
```javascript
if (cluster.isWorker) {
  const express = require('express');
  const app = express();
  app.get('/', (req, res) => {
    res.send('Handled by Worker ' + process.pid);
  });
  app.listen(3000);
}
```

#### **7.2 平滑重启**
逐步重启 Worker 以避免服务中断：
```javascript
// Master 收到信号后重启所有 Worker
process.on('SIGUSR2', () => {
  const workers = Object.values(cluster.workers);
  let i = 0;
  function restartNext() {
    if (i >= workers.length) return;
    const worker = workers[i++];
    worker.once('exit', () => {
      cluster.fork().once('listening', restartNext);
    });
    worker.kill();
  }
  restartNext();
});
```

### **8. 注意事项**
- **共享状态**：Worker 间不共享内存，需通过 Redis 或数据库管理共享数据。
- **端口冲突**：确保所有 Worker 监听同一端口（由 Master 统一绑定）。
- **日志管理**：建议集中收集日志（如使用 Winston 的传输功能）。
- **生产环境工具**：考虑使用 PM2 或 Kubernetes 等工具管理进程，功能更完善。

### **9. 性能对比**
| **场景**                | **单进程** | **Cluster（4 Workers）** |
|-------------------------|------------|--------------------------|
| 简单 HTTP 请求 QPS      | 5k         | 20k                      |
| CPU 密集型任务响应时间  | 1000ms     | 250ms（并行）            |

### **10. 完整示例**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} started`);

  // 创建与 CPU 核心数相等的 Worker
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.on('message', (msg) => {
      console.log(`Message from Worker ${worker.id}: ${msg}`);
    });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} exited`);
  });

} else {
  // Worker 进程逻辑
  const server = http.createServer((req, res) => {
    res.end(`Response from Worker ${process.pid}`);
    // 向 Master 发送消息
    process.send(`Handled request in ${process.pid}`);
  });

  server.listen(8000, () => {
    console.log(`Worker ${process.pid} listening on port 8000`);
  });
}
```

### **11. 总结**
Cluster 模块是 Node.js 实现多进程架构的核心工具，适合优化 CPU 密集型或高并发场景。结合 IPC 通信和负载均衡策略，可显著提升服务性能和可靠性。对于复杂场景，建议使用 PM2 等进程管理工具简化操作。