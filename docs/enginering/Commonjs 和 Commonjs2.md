# Commonjs 和 Commonjs2

在 JavaScript 模块化开发中，**CommonJS** 和 **CommonJS2** 是两个密切相关的术语，但它们之间存在细微差异，主要体现在模块导出和打包工具（如 Webpack）的处理方式上。以下是它们的核心区别及实际应用场景：

---

### **1. CommonJS（标准规范）**
- **定义**：CommonJS 是 Node.js 采用的模块化规范，核心语法为 `require` 和 `module.exports`。
- **导出方式**：
  ```javascript
  // 直接赋值给 module.exports
  module.exports = function() { /* ... */ };

  // 或通过 exports 对象扩展
  exports.foo = 'bar';
  exports.baz = () => { /* ... */ };
  ```
- **特点**：
  - 只能通过 `module.exports` 导出单个值（函数、对象等）。  
  - 若同时使用 `exports.xxx` 和 `module.exports`，后者会覆盖前者。
  - **模块导入**：`const myModule = require('./myModule');`（直接获取 `module.exports` 的值）。

---

### **2. CommonJS2（扩展实现）**
- **定义**：CommonJS2 是 Webpack 等打包工具对 CommonJS 规范的扩展，旨在兼容更多导出场景（尤其是与 ES Module 的互操作）。
- **导出方式**：
  ```javascript
  // 支持混合导出（兼容 ES Module 的 default 导出）
  exports.__esModule = true;  // 标记为 ES Module 转换后的模块
  exports.default = function() { /* ... */ };
  exports.foo = 'bar';
  ```
- **特点**：
  - 允许同时使用 `module.exports` 和 `exports.xxx`，导出结果会合并。  
  - 支持 `__esModule` 标记，帮助工具识别该模块是否为 ES Module 转换