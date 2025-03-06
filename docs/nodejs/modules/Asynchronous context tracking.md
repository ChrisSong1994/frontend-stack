# Asynchronous context tracking

Node.js 中的 **Asynchronous Context Tracking**（异步上下文追踪）模块主要用于在异步操作中维护和传递上下文信息，解决因 JavaScript 单线程事件循环模型导致的上下文丢失问题。该模块的核心实现基于 `async_hooks` 和 `AsyncLocalStorage`，以下是详细介绍：

### **1. 模块作用与背景**
- **单线程异步模型的挑战**  
  Node.js 采用单线程事件循环处理异步操作（如 I/O、定时器等），多个请求可能交替执行。若需在异步操作链中共享上下文（如请求 ID、用户认证信息），传统全局变量或闭包会导致数据污染或丢失。
- **解决方案**  
  通过 `AsyncLocalStorage` 类创建独立的存储空间，确保同一异步调用链中的代码可安全访问共享上下文，无需手动传递参数。

### **2. 核心类：AsyncLocalStorage**
`AsyncLocalStorage` 是 `async_hooks` 模块提供的高层 API，简化了异步上下文的追踪。以下是其核心方法：

#### **(1) `run(store, callback)`**  
创建一个新的上下文存储，并在回调函数及其嵌套的异步操作中共享该存储。  
```javascript
const { AsyncLocalStorage } = require('async_hooks');
const storage = new AsyncLocalStorage();

storage.run({ requestId: '123' }, () => {
  // 在此函数及其异步操作中均可访问存储
  someAsyncFunction();
});
```

#### **(2) `getStore()`**  
获取当前异步上下文中的存储数据。若未调用 `run` 或不在异步链中，则返回 `undefined`。  
```javascript
function someAsyncFunction() {
  const store = storage.getStore(); // { requestId: '123' }
}
```

#### **(3) `enterWith(store)`**  
强制将当前执行上下文绑定到指定的存储，适用于手动控制上下文（需谨慎使用）。  

#### **(4) `disable()` 与 `exit()`**  
- `disable()`：禁用当前实例的上下文追踪。
- `exit(callback)`：在回调中退出当前存储的上下文。

### **3. 使用场景**
1. **Web 请求跟踪**  
   在中间件中初始化请求上下文（如请求 ID、用户信息），后续处理函数（如数据库查询、日志）可直接访问该上下文，无需透传参数。  
   ```javascript
   app.use((req, res, next) => {
     storage.run({ userId: req.user.id }, () => next());
   });

   app.get('/data', async (req, res) => {
     const userId = storage.getStore().userId;
     const data = await fetchData(userId);
     res.send(data);
   });
   ```

2. **日志与监控**  
   在日志系统中自动附加请求 ID，便于链路追踪。  

3. **事务管理**  
   数据库事务或分布式追踪中，确保同一事务内的操作共享上下文。

### **4. 注意事项**
- **性能影响**  
  频繁创建存储或深度嵌套可能影响性能，需合理设计上下文范围。
- **与 Promise/Async 的兼容性**  
  `AsyncLocalStorage` 天然支持 Promise 链和 `async/await`，但需避免在未绑定上下文的异步操作中调用 `getStore()`。
- **避免内存泄漏**  
  及时清理不再使用的存储，尤其在长生命周期应用中。

### **5. 与其他模块的关系**
- **async_hooks**  
  `AsyncLocalStorage` 基于 `async_hooks` 实现，后者提供了底层异步资源生命周期钩子（如 `init`, `destroy`），但直接使用较复杂。
- **事件触发器（EventEmitter）**  
  若事件监听器中需访问上下文，需确保事件触发时已绑定存储（例如在 `emit` 前调用 `storage.run()`）。

### **6. 示例代码**
```javascript
const { AsyncLocalStorage } = require('async_hooks');
const storage = new AsyncLocalStorage();

// 初始化上下文
storage.run({ traceId: 'abc' }, async () => {
  console.log(storage.getStore().traceId); // 'abc'
  await someAsyncTask();
});

async function someAsyncTask() {
  setTimeout(() => {
    console.log(storage.getStore()?.traceId); // 'abc'
  }, 100);
}
```

### **7. 替代方案对比**
- **闭包**：仅适用于简单场景，无法跨越多层异步调用。
- **线程局部存储（Thread-Local Storage）**：Node.js 单线程模型不适用。
- **手动传递参数**：增加代码复杂度，易出错。

通过 `AsyncLocalStorage`，开发者能以声明式的方式管理异步上下文，显著提升代码可维护性，尤其适用于微服务、全链路追踪等复杂场景。