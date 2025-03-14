# requestAnimationFrame 和 requestIdleCallback

以下是关于 `requestAnimationFrame` 和 `requestIdleCallback` 的详细对比和使用指南，结合实际场景说明它们的用途、差异及最佳实践。

---

## **1. requestAnimationFrame (rAF)**
### **核心用途**
- **动画渲染**：确保动画与浏览器刷新率同步（通常 60Hz，即每 16.67ms 执行一次）。
- **布局/样式更新**：批量处理 DOM 操作，避免布局抖动（Layout Thrashing）。
- **性能优化**：替代 `setTimeout`/`setInterval` 实现流畅动画。

### **使用方式**
```javascript
function animate() {
  // 执行动画逻辑（如更新元素位置）
  element.style.left = `${leftValue}px`;

  // 递归调用以持续动画
  requestAnimationFrame(animate);
}

// 启动动画
requestAnimationFrame(animate);

// 取消动画
const animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);
```

### **特点**
- **同步屏幕刷新**：回调函数在浏览器下一次重绘前执行。
- **自动暂停**：当页面隐藏（如切到后台标签页）时停止调用，节省资源。
- **高优先级**：确保视觉更新优先执行。

### **适用场景**
- CSS 动画、Canvas 绘图、WebGL 渲染。
- 需要频繁更新 UI 的交互（如拖拽、滚动）。

---

## **2. requestIdleCallback (rIC)**
### **核心用途**
- **后台任务**：在浏览器空闲时段执行低优先级任务。
- **延迟任务**：处理非关键操作（如日志上报、数据预加载）。
- **性能优化**：避免阻塞主线程，提升用户交互响应速度。

### **使用方式**
```javascript
function processBackgroundTask(deadline) {
  // deadline.timeRemaining() 返回当前帧剩余空闲时间（单位 ms）
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    // 执行一个任务块
    const task = tasks.pop();
    task();
  }

  // 如果还有未完成的任务，继续调度
  if (tasks.length > 0) {
    requestIdleCallback(processBackgroundTask);
  }
}

// 启动空闲任务
requestIdleCallback(processBackgroundTask);

// 取消任务
const idleId = requestIdleCallback(processBackgroundTask);
cancelIdleCallback(idleId);
```

### **特点**
- **空闲触发**：仅在浏览器无高优先级任务时执行。
- **超时控制**：可通过 `timeout` 参数强制在指定时间内执行（但有阻塞风险）：
  ```javascript
  requestIdleCallback(processTask, { timeout: 2000 });
  ```
- **低优先级**：可能被高优先级事件（如用户点击）打断。

### **适用场景**
- 埋点日志批量上报。
- 预加载非关键资源（如懒加载图片）。
- 复杂计算的拆分执行（如大数据处理）。

---

## **3. 核心区别对比**
| **特性**              | **requestAnimationFrame**          | **requestIdleCallback**            |
|-----------------------|------------------------------------|-------------------------------------|
| **触发时机**          | 浏览器下一次重绘前                 | 浏览器空闲时段                      |
| **优先级**            | 高（与渲染相关）                   | 低（后台任务）                      |
| **执行频率**          | 与屏幕刷新率同步（如 60Hz）        | 不固定，依赖空闲时间                |
| **是否自动暂停**      | 页面隐藏时暂停                     | 页面隐藏时可能不执行（依赖浏览器实现）|
| **典型用途**          | 动画、UI 更新                      | 非关键后台任务                      |

---

## **4. 最佳实践**
### **结合使用 rAF 和 rIC**
```javascript
// 使用 rAF 处理动画
function updateAnimation() {
  // 动画逻辑
  requestAnimationFrame(updateAnimation);
}

// 使用 rIC 处理后台任务
function handleIdleTask(deadline) {
  // 任务处理逻辑
  requestIdleCallback(handleIdleTask);
}

// 启动
requestAnimationFrame(updateAnimation);
requestIdleCallback(handleIdleTask);
```

### **注意事项**
1. **避免在 rAF 中执行耗时操作**：会阻塞渲染导致卡顿。
2. **拆分 rIC 任务**：单次任务时间应小于 `deadline.timeRemaining()`，避免阻塞用户交互。
3. **慎用 `timeout`**：强制执行的 rIC 任务可能影响页面响应。
4. **兼容性处理**：`requestIdleCallback` 兼容性较差（不支持 IE 和旧版 Safari），需降级方案：
   ```javascript
   const requestIdleCallback = window.requestIdleCallback || 
     (callback => setTimeout(() => callback({ timeRemaining: () => 0 }), 0));
   ```

---

## **5. 实际应用示例**
### **动画 + 后台任务协作**
```javascript
// 动画逻辑（高优先级）
function updatePosition() {
  element.style.transform = `translateX(${x}px)`;
  x += 1;
  requestAnimationFrame(updatePosition);
}

// 日志分批上报（低优先级）
function logBatch(deadline) {
  while (logs.length > 0 && deadline.timeRemaining() > 50) {
    sendLog(logs.pop());
  }
  if (logs.length > 0) requestIdleCallback(logBatch);
}

// 启动
updatePosition();
logBatch();
```

---

## **总结**
- **`requestAnimationFrame`**：用于与渲染强相关的任务，确保流畅性。
- **`requestIdleCallback`**：用于非关键后台任务，避免阻塞主线程。
- **关键原则**：根据任务优先级选择 API，避免滥用导致性能问题。