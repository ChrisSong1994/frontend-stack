# javascript 中的数据类型

---

#### **一、JavaScript 数据类型分类**
JavaScript 数据类型分为 **原始类型（Primitive Types）** 和 **对象类型（Object Types）**，共 **8 种**：

| **类型**      | **说明**                                                                 | **示例**                     |
|---------------|-------------------------------------------------------------------------|-----------------------------|
| `Undefined`   | 变量未定义或未初始化时的默认值。                                             | `let a;`                    |
| `Null`        | 表示一个空值（`typeof` 的 bug 会返回 `"object"`）。                          | `let a = null;`             |
| `Boolean`     | 布尔值，`true` 或 `false`。                                               | `let a = true;`             |
| `Number`      | 整数或浮点数（包括 `Infinity`、`NaN`）。                                    | `let a = 42;`               |
| `BigInt`      | 表示任意精度的整数（ES2020+）。                                             | `let a = 9007199254740991n;`|
| `String`      | 字符串，用单引号、双引号或模板字符串表示。                                   | `let a = "hello";`          |
| `Symbol`      | 唯一且不可变的标识符（ES2015+）。                                           | `let a = Symbol('id');`     |
| `Object`      | 复杂数据结构，包括普通对象、数组、函数、日期等。                             | `let a = { name: 'Alice' };`|

---

#### **二、数据类型判断方法及对比**

##### **1. `typeof` 运算符**
- **用途**：快速判断原始类型（除 `null`）。
- **特点**：
  - 返回值为字符串（如 `"number"`）。
  - `typeof null` 返回 `"object"`（历史遗留问题）。
  - 无法区分对象的具体类型（如数组、日期）。
- **示例**：
  ```javascript
  typeof undefined;    // "undefined"
  typeof true;         // "boolean"
  typeof 42;           // "number"
  typeof 42n;          // "bigint"
  typeof "hello";      // "string"
  typeof Symbol('id'); // "symbol"
  typeof null;         // "object"（注意！）
  typeof {};           // "object"
  typeof [];           // "object"
  typeof function(){}; // "function"
  ```

##### **2. `instanceof` 运算符**
- **用途**：判断对象是否为某个构造函数的实例。
- **特点**：
  - 适用于对象类型（如数组、日期）。
  - 无法判断原始类型（`instanceof` 对原始类型无效）。
  - 跨窗口（如 iframe）时可能失效。
- **示例**：
  ```javascript
  [] instanceof Array;          // true
  {} instanceof Object;         // true
  new Date() instanceof Date;   // true
  function(){} instanceof Function; // true
  42 instanceof Number;         // false（原始类型非对象）
  ```

##### **3. `Object.prototype.toString.call()`**
- **用途**：最全面的类型判断方法。
- **特点**：
  - 返回格式为 `"[object Type]"` 的字符串。
  - 可区分所有内置对象类型（如 `Array`、`Date`）。
- **示例**：
  ```javascript
  Object.prototype.toString.call(undefined);   // "[object Undefined]"
  Object.prototype.toString.call(null);       // "[object Null]"
  Object.prototype.toString.call(true);       // "[object Boolean]"
  Object.prototype.toString.call(42);         // "[object Number]"
  Object.prototype.toString.call(42n);        // "[object BigInt]"
  Object.prototype.toString.call("hello");    // "[object String]"
  Object.prototype.toString.call(Symbol('id'));// "[object Symbol]"
  Object.prototype.toString.call([]);         // "[object Array]"
  Object.prototype.toString.call({});         // "[object Object]"
  Object.prototype.toString.call(new Date()); // "[object Date]"
  ```

##### **4. 其他专用方法**
- **`Array.isArray()`**：判断是否为数组。
  ```javascript
  Array.isArray([]);    // true
  Array.isArray({});    // false
  ```
- **`Number.isNaN()`**：严格判断 `NaN`。
  ```javascript
  Number.isNaN(NaN);    // true
  Number.isNaN("NaN");  // false（与全局 isNaN 不同）
  ```

---

#### **三、数据类型判断方法对比**

| **判断方法**                | **适用场景**                     | **优点**                         | **缺点**                         |
|-----------------------------|----------------------------------|----------------------------------|----------------------------------|
| **`typeof`**                | 快速判断原始类型                 | 简单、速度快                     | `null` 返回 `"object"`，无法区分对象类型 |
| **`instanceof`**            | 判断对象是否为特定类型实例       | 可检测自定义对象类型             | 无法判断原始类型，跨窗口失效     |
| **`Object.prototype.toString.call()`** | 精确判断所有类型           | 支持全部内置类型，结果标准化     | 代码较长，需记忆类型字符串       |
| **`Array.isArray()`**       | 判断数组                         | 准确、直接                       | 仅适用于数组                     |

---

#### **四、特殊值处理技巧**
1. **判断 `null`**：
   ```javascript
   const isNull = (value) => value === null;
   ```

2. **判断 `NaN`**：
   ```javascript
   const isNaN = (value) => Number.isNaN(value);
   ```

3. **判断 `undefined`**：
   ```javascript
   const isUndefined = (value) => value === undefined;
   ```

4. **通用类型判断函数**：
   ```javascript
   function getType(value) {
     return Object.prototype.toString.call(value)
       .slice(8, -1)
       .toLowerCase();
   }
   getType([]); // "array"
   getType(null); // "null"
   ```

---

#### **五、总结**
- **优先使用 `typeof`**：判断原始类型（注意 `null` 的陷阱）。
- **对象类型判断**：使用 `instanceof` 或 `Object.prototype.toString.call()`。
- **数组判断**：首选 `Array.isArray()`。
- **严格类型检查**：推荐 `Object.prototype.toString.call()`，结果最可靠。

掌握这些方法可以高效解决开发中的类型判断问题，避免因类型混淆导致的逻辑错误。