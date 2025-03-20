# react-native 基本原理

React Native 的底层原理核心在于 **JavaScript 与原生代码的通信机制**，通过 **Bridge（桥接）** 和 **Virtual DOM** 实现跨平台的原生渲染。以下是其核心原理的详细解析：

---

### **1. Bridge 通信机制** 
#### **模块配置表**
- **作用**：React Native 在 JavaScript 和原生（iOS/Android）两端维护一份**模块配置表**，记录所有暴露给对方的模块和方法。通过 `ModuleID`、`MethodID` 和参数（`Arguments`）唯一确定调用的目标方法。
- **生成方式**：
  - **原生模块**：通过 `RCT_EXPORT_MODULE` 和 `RCT_EXPORT_METHOD` 宏注册模块和方法，生成配置表并注入 JavaScript 全局变量 `__fbBatchedBridgeConfig` 。
  - **JavaScript 模块**：通过 `MessageQueue` 管理调用队列，将回调函数转换为 `CallbackID` 并缓存。

#### **通信流程**
- **JS 调用 Native**：
  1. JS 将调用分解为 `ModuleID`、`MethodID` 和参数。
  2. 调用请求加入队列，等待原生线程轮询。
  3. 原生层通过配置表找到对应模块和方法，处理参数类型（如将 JS 数字转为 `NSNumber`），动态调用原生方法。
- **Native 调用 JS**：
  - 原生事件（如用户点击）触发后，通过 Bridge 将事件数据传递给 JS 线程，JS 处理后生成新的 Virtual DOM 指令，再通过 Bridge 更新原生 UI。

#### **异步批量处理**
- JS 和原生代码通过**异步消息队列**通信，避免阻塞主线程。例如，JS 调用原生方法时，请求被批量处理后再统一执行，提升性能。

---

### **2. Virtual DOM 与渲染流程** 
#### **Virtual DOM 的作用**
- React 通过 **Virtual DOM** 抽象界面结构，在内存中维护轻量级的 JavaScript 对象树。当状态变化时，React 通过 **DOM Diff 算法** 计算最小变更集，避免全量更新真实 DOM。

#### **原生渲染流程**
1. **JSX 解析**：JSX 代码被转换为 JavaScript，生成 Virtual DOM 树。
2. **布局计算**：通过 **Yoga 引擎**（基于 Flexbox）计算布局，生成 `Shadow Tree`（布局信息树）。
3. **原生组件映射**：将 Virtual DOM 节点映射为原生组件（如 `<View>` 对应 iOS 的 `UIView` 或 Android 的 `View`）。
4. **UI 更新**：通过 Bridge 将布局和属性变更传递给原生层，触发原生组件的重绘。

---

### **3. 启动与模块加载** 
#### **启动流程（以 iOS 为例）**
1. **初始化 Bridge**：创建 `RCTBridge` 和 `RCTRootView`，加载 JS Bundle 文件。
2. **注册原生模块**：遍历所有 `RCT_EXPORT_MODULE` 注册的模块，生成模块配置表。
3. **执行 JS 代码**：通过 JavaScriptCore（iOS）或 V8（Android）执行 JS Bundle，触发 `AppRegistry.runApplication()`。
4. **渲染 UI**：JS 生成初始 Virtual DOM，通过 Bridge 调用原生 `RCTUIManager` 创建并布局原生组件。

#### **热更新与动态加载**
- **远程加载 JS Bundle**：通过 `RCTJavaScriptLoader` 从服务器动态加载更新后的代码，绕过应用商店审核。

---

### **4. 线程模型** 
- **JS 线程**：单独线程执行 JavaScript 代码，处理业务逻辑和 Virtual DOM 计算。
- **UI 主线程**：原生平台的主线程，负责渲染 UI 和响应用户事件。
- **Shadow 线程**：后台线程处理布局计算（如 Yoga 引擎），避免阻塞主线程。

---

### **5. 事件处理** 
- **原生事件传递**：用户操作（如点击）由原生层捕获，通过 Bridge 将事件数据序列化为 JSON 传递给 JS 层。
- **JS 事件处理**：JS 层根据事件类型调用对应处理函数，更新状态并触发重新渲染。
- **回调机制**：JS 回调通过 `CallbackID` 注册，原生方法执行完成后通过 Bridge 回调 JS。

---

### **6. 样式与布局**
- **Flexbox 布局**：React Native 实现了一个简化的 CSS 子集，主要依赖 Flexbox 进行跨平台布局，通过 Yoga 引擎转换为原生布局参数。
- **样式转换**：JS 中的样式对象（如 `{ fontSize: 14 }`）被转换为平台特定的属性（如 iOS 的 `UIFont`）。

---

### **总结**
React Native 的核心原理是通过 **Bridge 实现 JS 与原生的双向通信**，结合 **Virtual DOM 的高效渲染** 和 **Flexbox 布局引擎**，达到接近原生性能的跨平台开发体验。其优势在于：
1. **动态更新**：JS Bundle 可远程加载，绕过应用商店审核。
2. **开发效率**：使用 React 语法和组件化开发，降低多平台适配成本。
3. **性能优化**：异步通信、批量处理和线程分离减少主线程阻塞。

局限性则包括 Bridge 通信的开销（在复杂交互场景可能成为瓶颈）和对原生模块的依赖（需定制 Bridge 扩展功能）。未来随着 Fabric 架构和 JSI（JavaScript Interface）的引入，Bridge 可能被更高效的直接内存访问取代，进一步优化性能。