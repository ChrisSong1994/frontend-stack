# Async hooks

Node.js 中的 `async_hooks` 模块是一个用于追踪异步资源生命周期的工具，它通过钩子函数（Hooks）提供对异步操作的细粒度监控和分析能力。以下从核心概念、API 设计、使用场景和注意事项等方面详细介绍：

### 一、模块概述
`async_hooks` 模块旨在解决 Node.js 异步编程中难以追踪操作上下文和依赖关系的痛点。它通过为每个异步资源分配唯一标识符（`asyncId`），并在其生命周期关键节点触发回调函数，帮助开发者构建异步操作的完整链路视图。

#### 核心特性：
• **异步资源抽象**：将任何具有关联回调的对象（如网络请求、定时器、文件操作等）视为异步资源。
• **线程独立性**：若使用 Worker 线程，每个线程拥有独立的 `async_hooks` 接口和异步 ID 集合。
• **实验性状态**：截至 Node.js v18.x，该模块仍标记为 `Stability: 1 - Experimental`，API 可能发生变动。

### 二、核心 API 与钩子函数
通过 `async_hooks.createHook(callbacks)` 创建钩子实例，支持以下生命周期回调：

1. **`init(asyncId, type, triggerAsyncId)`**  
   • **触发时机**：异步资源初始化时（如创建 `setTimeout` 或发起 HTTP 请求）。
   • **参数解析**：
     ◦ `asyncId`：当前资源的唯一 ID。
     ◦ `type`：资源类型（如 `Timeout`、`FSReqCallback`）。
     ◦ `triggerAsyncId`：触发当前资源的父资源 ID，用于构建依赖树。

2. **`before(asyncId)`**  
   在异步回调执行前触发，适合记录操作开始时间或上下文切换。

3. **`after(asyncId)`**  
   在异步回调执行后触发，常与 `before` 配合计算执行耗时。

4. **`destroy(asyncId)`**  
   资源销毁时触发，用于清理关联数据或统计资源存活时间。

#### 示例：追踪异步操作耗时
```javascript
const asyncHooks = require('async_hooks');
const asyncIdMap = new Map();

const hook = asyncHooks.createHook({
  init(asyncId, type) {
    asyncIdMap.set(asyncId, { type, start: process.hrtime() });
  },
  destroy(asyncId) {
    const { type, start } = asyncIdMap.get(asyncId);
    const duration = process.hrtime(start);
    console.log(`${type} (ID:${asyncId}) 耗时：${duration[0]}s ${duration[1]/1e6}ms`);
    asyncIdMap.delete(asyncId);
  }
});
hook.enable();
```
此代码通过 `init` 和 `destroy` 钩子记录异步操作的执行时间，适用于性能分析。

### 三、典型应用场景
1. **异步链路追踪**  
   结合 `triggerAsyncId` 构建异步调用树，用于调试复杂嵌套操作（如数据库查询与文件读取的依赖关系）。

2. **上下文传递**  
   配合 `AsyncLocalStorage` 类实现请求级上下文共享（如全链路日志跟踪），替代传统的 `domain` 模块。

3. **资源泄漏检测**  
   监控未及时销毁的资源（如未关闭的定时器），通过统计 `init` 和 `destroy` 调用次数对比发现问题。

4. **性能分析**  
   统计各类型异步操作的平均耗时，定位性能瓶颈（如高延迟的 DNS 查询）。

### 四、注意事项与限制
1. **性能开销**  
   频繁的钩子调用可能影响性能，生产环境需谨慎启用，建议仅用于调试阶段。

2. **资源类型限制**  
   部分内置模块（如 `crypto`）的异步操作可能无法被完整追踪。

3. **多线程环境**  
   Worker 线程中的异步操作需独立监控，主线程钩子不跨线程生效。

4. **实验性 API**  
   部分功能（如 Promise 追踪）在不同 Node.js 版本中行为可能不一致，需关注版本更新日志。

### 五、与类似工具对比
| 工具/模块          | 优势                          | 局限性                     |
|--------------------|-----------------------------|--------------------------|
| `async_hooks`      | 原生支持，细粒度控制            | 性能开销大，API 不稳定      |
| `Performance Hooks`| 低开销，标准化指标收集          | 无法追踪上下文依赖关系      |
| 第三方 APM 工具     | 开箱即用，可视化报告            | 依赖外部服务，定制性差      |

### 总结
`async_hooks` 为 Node.js 的异步监控提供了底层能力，适合需要深度定制化分析的场景。尽管其实验性状态和性能问题限制了大规模生产使用，但在调试、性能调优和上下文管理（如实现类似 OpenTelemetry 的链路追踪）中具有不可替代的价值。建议结合具体需求权衡使用，并持续关注 Node.js 官方文档的更新。