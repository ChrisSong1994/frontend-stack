# polyfill 和 辅助函数
Babel 中的 **Polyfill** 和 **辅助函数（Helper Functions）** 是两种不同的机制，分别解决不同的问题。它们的核心区别如下：

---

### **1. Polyfill（垫片）**
#### **作用**  
- **填补浏览器缺失的 API**：将 ES6+ 的全局 API（如 `Promise`、`Array.from`、`Object.assign`）在旧版浏览器中实现。
- **修改全局环境**：直接向全局作用域（如 `window`、`global`）添加缺失的方法或对象。

#### **典型场景**  
- 使用 `Promise`、`Map`、`Set` 等新数据结构或方法。
- 使用 `Array.prototype.includes`、`String.prototype.padStart` 等新原型方法。

#### **示例**  
```javascript
// 使用 `Promise` 的代码
const p = new Promise(() => {});
```
- 旧版浏览器没有 `Promise`，需通过 Polyfill（如 `core-js`）在全局添加 `Promise` 的实现。

#### **实现方式**  
- **直接引入完整 Polyfill**（简单但体积大）：
  ```javascript
  import 'core-js/stable'; // 引入所有 Polyfill
  ```
- **按需引入**（推荐，需配合 `@babel/preset-env` 的 `useBuiltIns: 'usage'`）：
  ```javascript
  // Babel 自动检测代码中使用的 API，按需引入 Polyfill
  ```

---

### **2. 辅助函数（Helper Functions）**
#### **作用**  
- **实现语法转换**：在代码转换过程中，生成必要的工具函数来模拟 ES6+ 语法。
- **避免重复代码**：通过复用辅助函数减少打包体积。

#### **典型场景**  
- 转换 `class`、`async/await`、`解构赋值`、`扩展运算符` 等语法。
- 避免在每个文件重复生成相同的工具代码。

#### **示例**  
```javascript
// ES6 的 `class` 语法
class Foo {}
```
- Babel 转换为 ES5 时，需要生成 `_classCallCheck` 等辅助函数：
  ```javascript
  function _classCallCheck(instance, Constructor) { /* ... */ }
  var Foo = function Foo() {
    _classCallCheck(this, Foo);
  };
  ```

#### **实现方式**  
- **直接内联**（默认，每个文件生成自己的辅助函数）：
  ```javascript
  // 每个转换后的文件都会包含所需的辅助函数
  ```
- **复用共享辅助函数**（推荐，使用 `@babel/plugin-transform-runtime`）：
  ```javascript
  // 从 `@babel/runtime` 中引入辅助函数，避免重复
  import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
  ```

---

### **核心区别对比**
| **特性**         | **Polyfill**                          | **辅助函数**                          |
|------------------|---------------------------------------|--------------------------------------|
| **解决的问题**   | 填补浏览器缺失的 **全局 API**           | 实现 ES6+ **语法转换** 的工具函数       |
| **影响范围**     | 修改全局环境（如 `window.Promise`）     | 局部作用，生成工具函数供转换后的代码使用 |
| **代码体积**     | 可能较大（尤其完整引入时）              | 较小（可复用共享辅助函数）              |
| **典型库**       | `core-js`、`regenerator-runtime`       | `@babel/runtime`、`@babel/helpers`    |
| **配置方式**     | `@babel/preset-env` + `useBuiltIns`    | `@babel/plugin-transform-runtime`     |

---

### **最佳实践**
1. **Polyfill**：  
   - 使用 `@babel/preset-env` 的 `useBuiltIns: 'usage'` 按需引入。  
   - 在入口文件顶部引入 `core-js` 和 `regenerator-runtime`：
     ```javascript
     import 'core-js/stable';
     import 'regenerator-runtime/runtime';
     ```

2. **辅助函数**：  
   - 使用 `@babel/plugin-transform-runtime` 复用辅助函数。  
   - 安装运行时依赖：
     ```bash
     npm install --save @babel/runtime
     ```

---

### **总结**
- **Polyfill** 是用于填补浏览器缺失的 **API**，直接影响全局环境。  
- **辅助函数** 是用于支持 **语法转换** 的工具代码，避免重复生成。  
- 两者通常结合使用：Polyfill 解决 API 缺失问题，辅助函数解决语法转换的代码冗余问题。