# Node.js 事件循环

Node.js 的事件循环是其实现高性能异步 I/O 的核心机制，其设计基于 **libuv 库**，采用单线程、非阻塞模型，能够高效处理高并发请求。以下从核心机制、执行流程、与浏览器的差异、常见问题及优化策略四个维度详细解析：

---

### 一、事件循环的核心机制
#### 1. **六个阶段与职责**
Node.js 事件循环分为六个阶段，每个阶段负责处理特定类型的任务：
- **Timers 阶段**：执行 `setTimeout` 和 `setInterval` 的到期回调。
- **I/O Callbacks 阶段**：处理上一轮未完成的 I/O 回调（如网络错误、文件操作错误）。
- **Idle/Prepare 阶段**：Node.js 内部维护阶段，开发者无需关注。
- **Poll 阶段**：核心阶段，处理新的 I/O 事件（如文件读取、网络请求回调），若队列为空则可能阻塞等待新事件。
- **Check 阶段**：执行 `setImmediate` 的回调。
- **Close Callbacks 阶段**：处理关闭事件（如 `socket.on('close', ...)`）。

#### 2. **微任务与宏任务**
- **微任务**（`Promise.then`、`process.nextTick`）：在每个阶段切换时优先执行。
  - `process.nextTick` 的优先级高于 Promise。
- **宏任务**（`setTimeout`、`setImmediate`、I/O 回调）：在事件循环的特定阶段执行。

---

### 二、事件循环的执行流程
#### 1. **循环顺序与阶段切换**
事件循环按以下顺序迭代执行：
```
Timers → Pending I/O → Idle/Prepare → Poll → Check → Close
```
- **Poll 阶段的核心逻辑**：
  1. 计算阻塞时间（基于最近的定时器到期时间）。
  2. 执行队列中的 I/O 回调，直到队列为空或达到系统限制。
  3. 若队列为空且存在 `setImmediate` 回调，则进入 Check 阶段；否则阻塞等待新事件。

#### 2. **关键特性**
- **非阻塞 I/O 实现**：通过 libuv 将 I/O 操作委托给操作系统或线程池，主线程继续处理其他任务。
  - 例如文件读取时，主线程仅发起请求，实际读写由线程池处理，完成后将回调加入 Poll 队列。
- **事件队列的优先级**：
  ```javascript
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  ```
  上述代码的输出顺序不确定，但在 I/O 回调中 `setImmediate` 总是优先于 `setTimeout`。

---

### 三、与浏览器事件循环的差异
#### 1. **微任务执行时机**
- **浏览器**：微任务在单个宏任务执行后立即执行（如 `Promise.then` 在 `setTimeout` 回调后）。
- **Node.js**：微任务在事件循环的 **阶段之间** 执行（如 Timers 阶段结束后、I/O Callbacks 阶段开始前）。

#### 2. **阶段划分与任务类型**
- **浏览器**：主要分为宏任务（如 `setTimeout`）和微任务（如 `Promise`），无明确阶段划分。
- **Node.js**：任务按阶段严格分类，且每个阶段有独立队列。

---

### 四、常见问题与优化策略
#### 1. **事件循环阻塞**
- **原因**：长时间运行的同步代码（如 CPU 密集型计算）会阻塞主线程。
- **解决方案**：
  - 使用 `setImmediate` 或 `process.nextTick` 分解任务。
  - 通过 **Worker Threads** 处理 CPU 密集型任务。
  ```javascript
  const { Worker } = require('worker_threads');
  if (isMainThread) {
    new Worker(__filename); // 子线程处理任务
  } else {
    // 执行耗时操作
  }
  ```

#### 2. **内存泄漏**
- **原因**：未释放资源（如未关闭的数据库连接、未清除的监听器）。
- **排查工具**：使用 `heapdump` 生成堆快照，通过 Chrome DevTools 分析引用链。

#### 3. **回调地狱**
- **优化方案**：使用 `Promise` 或 `async/await` 替代嵌套回调。
  ```javascript
  async function fetchData() {
    const data1 = await someAsyncOp();
    const data2 = await anotherAsyncOp(data1);
    return data2;
  }
  ```

---

### 五、应用场景与最佳实践
- **适用场景**：实时应用（聊天服务器）、API 服务、微服务架构。
- **最佳实践**：
  1. **避免同步阻塞操作**：如使用 `fs.readFileSync` 改为 `fs.readFile`。
  2. **合理使用事件驱动**：通过 `EventEmitter` 实现模块间解耦。
  3. **监控与调优**：使用 `perf_hooks` 分析阶段耗时，优化高延迟阶段。

通过理解事件循环的机制，开发者可以编写高效、健壮的 Node.js 应用。若需深入调试，可结合 `node --inspect` 使用 Chrome DevTools 分析事件循环状态。