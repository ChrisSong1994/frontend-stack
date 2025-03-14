# 原生和 js 通信原理

以下是关于 **JSBridge** 与 **H5 双向通信** 的核心原理及实现机制的详细解析：

---

### **一、JSBridge 的双向通信原理**
JSBridge 是 **WebView（H5）与原生代码（Native）** 之间的通信桥梁，其核心目标是通过标准化协议实现双向调用和数据传递。其原理不直接基于 IPC（进程间通信），而是通过 **WebView 的内置能力** 实现，具体流程如下：

---

#### **1. H5 调用 Native**
**原理**：通过 WebView 提供的接口触发原生代码执行，常见方式包括：
- **URL Scheme 拦截**  
  - H5 通过修改 `location.href` 或发送 `iframe.src` 请求特定格式的 URL（如 `jsbridge://methodName?params=xxx`）。
  - 原生层（Android/iOS）监听 WebView 的 URL 请求，解析 Scheme 和参数，执行对应逻辑。
  ```javascript
  // H5 调用 Native
  function callNative(method, params) {
    const url = `jsbridge://${method}?params=${encodeURIComponent(JSON.stringify(params))}`;
    const iframe = document.createElement('iframe');
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 0);
  }
  ```

- **API 注入**  
  - 原生层向 WebView 注入全局对象（如 `window.NativeBridge`），H5 直接调用该对象的方法。
  ```java
  // Android 注入对象
  webView.addJavascriptInterface(new NativeBridge(), "NativeBridge");
  ```
  ```javascript
  // H5 调用注入的 API
  window.NativeBridge.showToast("Hello");
  ```

---

#### **2. Native 调用 H5**
**原理**：原生层通过 WebView 提供的接口直接执行 JavaScript 代码：
- **Android**：使用 `evaluateJavascript()` 方法（推荐）或 `loadUrl("javascript:...")`。
  ```java
  webView.evaluateJavascript("window.onNativeEvent('data')", null);
  ```

- **iOS**：通过 `WKWebView` 的 `evaluateJavaScript:completionHandler:` 方法。
  ```swift
  webView.evaluateJavaScript("window.onNativeEvent('data')") { result, error in }
  ```

---

#### **3. 带回调的双向通信**
**原理**：通过唯一标识符（`callbackId`）实现异步回调：
1. **H5 调用 Native 并注册回调**：
   ```javascript
   const callbackId = `cb_${Date.now()}`;
   window.JSBridgeCallbacks[callbackId] = (data) => {
     console.log('收到 Native 回调:', data);
   };
   callNative('getUserInfo', { callbackId });
   ```

2. **Native 处理完成后触发回调**：
   ```java
   // Android 触发 H5 回调
   String js = "window.JSBridgeCallbacks['" + callbackId + "']('" + result + "')";
   webView.evaluateJavascript(js, null);
   ```

---

### **二、与 IPC 的关系**
**JSBridge 的通信不直接依赖 IPC**，但部分场景下底层可能涉及进程间通信：
- **WebView 进程模型**：
  - **Android**：WebView 默认与主线程共享进程，通信直接通过内存交互。
  - **iOS WKWebView**：运行在独立进程，原生与 WebView 的通信需通过 IPC（如 XPC），但 JSBridge 的实现对开发者透明，由系统封装完成。

- **通信本质**：JSBridge 的通信是 **跨语言调用（JS ↔ Java/OC/Swift）**，而非传统意义的跨进程通信（IPC）。

---

### **三、关键技术挑战与优化**
1. **性能瓶颈**  
   - **URL Scheme 拦截**：频繁调用可能因 URL 解析和线程切换导致延迟。
   - **优化方案**：改用 `prompt/console` 等同步 API 拦截（需注意兼容性），或通过长连接复用通信通道。

2. **安全性**  
   - **XSS 风险**：避免注入恶意全局对象（如 `window.NativeBridge` 需严格校验来源）。
   - **Scheme 劫持**：使用自定义加密 Scheme（如 `myapp-encrypted://`）防止第三方应用拦截。

3. **跨平台一致性**  
   - **统一协议**：设计与平台无关的通信格式（如 JSON-RPC），封装平台差异。
   - **桥接库**：使用开源库（如 [WebViewJavascriptBridge](https://github.com/marcuswestin/WebViewJavascriptBridge)）简化实现。

---

### **四、完整通信流程图**
```
+----------------+          H5 Call Native          +----------------+
|                |  ------------------------------>  |                |
|      H5        |                                   |     Native     |
|                |  <------------------------------  |                |
+----------------+          Native Call H5           +----------------+
       ▲                                                    ▲
       | 1. URL Scheme / API Injection                      | 3. Callback
       | 2. Register Callback                                | 4. Execute JS
       |                                                    |
+----------------+                                   +----------------+
| JSBridge       |                                   | WebView        |
| Callback Queue |                                   | evaluateJavascript
+----------------+                                   +----------------+
```

---

### **五、总结**
- **JSBridge 本质**：基于 WebView 的内置能力（非 IPC），通过 URL Scheme 拦截或 API 注入实现跨语言通信。
- **适用场景**：Hybrid 应用开发、小程序、动态化页面。
- **替代方案**：更现代的通信方式如 `MessageChannel`、`postMessage`，但核心原理类似。