# Object.prototype.toString 判断数据类型

`Object.prototype.toString.call()` 是 JavaScript 中一种常用的判断数据类型的方法，其原理基于以下机制：

---

### **1. 核心原理**
`Object.prototype.toString` 方法会返回一个表示对象的字符串，格式为 `[object Type]`，其中 **`Type`** 是对象的内部 **`[[Class]]`** 属性（或通过 `Symbol.toStringTag` 自定义的标签）。  
通过 `call()` 或 `apply()` 改变 `this` 的指向，使其作用于目标值，从而获取其类型。

---

### **2. 实现步骤**
- **步骤 1**：调用 `Object.prototype.toString` 方法。  
  该方法被所有对象继承，但许多内置对象（如数组、函数等）会重写自己的 `toString` 方法，导致直接调用时无法返回 `[object Type]`。
  
- **步骤 2**：用 `call()` 将 `this` 绑定到目标值。  
  例如，`Object.prototype.toString.call([])` 中的 `this` 指向数组实例，触发原生 `toString` 逻辑。

- **步骤 3**：根据目标值的 **内部类型** 生成结果。  
  例如：  
  - `Object.prototype.toString.call([]) → [object Array]`  
  - `Object.prototype.toString.call({}) → [object Object]`  
  - `Object.prototype.toString.call(123) → [object Number]`

---

### **3. 为何必须用 `call()`？**
直接调用 `value.toString()` 时：
- 如果值是一个 **对象**，会调用其自身的 `toString` 方法（可能被重写，如数组的 `toString` 返回元素拼接的字符串）。  
- 如果值是 **基本类型**（如 `123`、`"abc"`），引擎会先将其包装为对应的 **包装对象**（如 `new Number(123)`），再调用 `toString`。

使用 `Object.prototype.toString.call()` 可绕过这些干扰，直接获取内部类型。

---

### **4. 特殊值的处理**
- **`null` 和 `undefined`**：  
  虽然它们是原始值，但 `Object.prototype.toString.call()` 会特殊处理：  
  ```javascript
  Object.prototype.toString.call(null)      // [object Null]
  Object.prototype.toString.call(undefined) // [object Undefined]
  ```

- **自定义类型标签（ES6+）**：  
  若对象定义了 `Symbol.toStringTag` 属性，`toString` 会优先使用其值作为 `Type`：  
  ```javascript
  const obj = { [Symbol.toStringTag]: "MyObject" };
  Object.prototype.toString.call(obj) // [object MyObject]
  ```

---

### **5. 对比其他方法**
| 方法                     | 局限性                              | 示例结果                  |
|--------------------------|-----------------------------------|---------------------------|
| `typeof`                 | 无法区分对象类型（返回 `"object"`） | `typeof [] → "object"`    |
| `instanceof`             | 依赖原型链，跨框架失效             | `[] instanceof Array → true` |
| `Object.prototype.toString.call()` | 精准识别所有类型                  | `[object Array]`          |

---

### **6. 代码示例**
```javascript
// 基本类型
console.log(Object.prototype.toString.call(123));     // [object Number]
console.log(Object.prototype.toString.call("abc"));  // [object String]
console.log(Object.prototype.toString.call(true));   // [object Boolean]

// 对象类型
console.log(Object.prototype.toString.call([]));      // [object Array]
console.log(Object.prototype.toString.call({}));      // [object Object]
console.log(Object.prototype.toString.call(new Date())); // [object Date]

// 特殊值
console.log(Object.prototype.toString.call(null));      // [object Null]
console.log(Object.prototype.toString.call(undefined)); // [object Undefined]

// 自定义类型标签
const obj = { [Symbol.toStringTag]: "MyObject" };
console.log(Object.prototype.toString.call(obj));      // [object MyObject]
```

---

### **7. 总结**
- **原理**：利用 `Object.prototype.toString` 返回内部 `[[Class]]` 或 `Symbol.toStringTag` 标签。  
- **关键**：通过 `call()` 确保调用原生 `toString`，而非被重写的方法。  
- **适用性**：精准判断所有数据类型，包括基本类型、内置对象及特殊值（`null`、`undefined`）。