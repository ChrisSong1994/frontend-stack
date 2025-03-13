# Js 代码执行流程

以下是 JavaScript 代码执行流程的详细解析，涵盖从代码加载到异步任务处理的完整过程。通过 **同步任务执行、事件循环（Event Loop）、作用域链、闭包** 等核心概念，逐步拆解其运行机制：

---

### **一、代码执行流程总览**
JavaScript 代码的执行流程可分为以下几个阶段：
1. **代码解析与编译**
2. **全局执行上下文创建**
3. **函数调用与执行上下文栈**
4. **作用域链与闭包形成**
5. **事件循环与异步任务处理**

---

### **二、分步详解**
#### **1. 代码解析与编译**
JavaScript 引擎在代码执行前会进行 **预编译（预解析）**：
- **变量提升**：将 `var` 声明的变量和函数声明（`function`）提升到作用域顶部（值为 `undefined` 或函数体）。
- **生成作用域链**：确定词法作用域（静态作用域）。
- **生成执行上下文**（Execution Context）：包括变量对象（VO/AO）、作用域链和 `this` 绑定。

**示例代码分析**：
```javascript
console.log(a); // undefined（变量提升）
var a = 10;
function foo() { console.log("foo"); }
foo(); // "foo"
```

---

#### **2. 全局执行上下文创建**
- **创建阶段**：
  - 创建全局对象（浏览器中为 `window`，Node.js 中为 `global`）。
  - 建立全局作用域链。
  - 初始化 `this`（指向全局对象）。
  - 处理变量提升和函数声明。
- **执行阶段**：
  - 逐行执行代码，进行变量赋值和函数调用。

---

#### **3. 函数调用与执行上下文栈**
每次函数调用会创建一个新的 **函数执行上下文**，并压入调用栈（Call Stack）。栈顶的上下文处于执行中，执行完毕后弹出。

**示例**：
```javascript
function outer() {
  console.log("outer");
  inner();
}

function inner() {
  console.log("inner");
}

outer(); 
// 调用栈变化：全局 → outer() → inner()
// 输出顺序：outer → inner
```

---

#### **4. 作用域链与闭包**
- **作用域链**：每个执行上下文都有一个关联的作用域链，用于变量查找。链的顺序由代码的 **词法结构（定义位置）** 决定。
- **闭包**：函数可以记住并访问其词法作用域，即使函数在其外部执行。

**闭包示例**：
```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
// createCounter 的执行上下文已弹出栈，但闭包保留了 count 的引用
```

---

#### **5. 事件循环（Event Loop）与异步任务**
JavaScript 是单线程语言，通过 **事件循环** 处理异步任务，避免阻塞主线程。

##### **任务队列分类**
| **队列类型**       | **任务示例**                     | **优先级** |
|--------------------|----------------------------------|-----------|
| **宏任务队列**     | `setTimeout`、`setInterval`、I/O | 低        |
| **微任务队列**     | `Promise.then`、`MutationObserver` | 高        |
| **动画帧队列**     | `requestAnimationFrame`          | 中        |

##### **事件循环流程**
1. 执行全局同步代码。
2. 执行当前 **微任务队列** 中的所有任务。
3. 执行 **宏任务队列** 中的一个任务。
4. 重复步骤 2-3。

**执行顺序示例**：
```javascript
console.log("1"); // 同步任务

setTimeout(() => console.log("2"), 0); // 宏任务

Promise.resolve().then(() => console.log("3")); // 微任务

console.log("4"); // 同步任务

// 输出顺序：1 → 4 → 3 → 2
```

---

### **三、内存管理与垃圾回收**
- **内存分配**：变量和对象创建时分配内存。
- **垃圾回收**（Garbage Collection）：
  - **标记-清除算法**：标记不再被引用的对象并回收。
  - **闭包内存泄漏**：未及时释放的闭包引用会导致内存无法回收。

**闭包内存泄漏示例**：
```javascript
function createHeavyObject() {
  const largeArray = new Array(1000000).fill("*");
  return () => largeArray; // 闭包保留 largeArray 的引用
}

const getArray = createHeavyObject();
// 即使不再使用 getArray，largeArray 仍无法被回收
```

---

### **四、完整执行流程示例**
**代码**：
```javascript
let globalVar = "global";

function outer() {
  let outerVar = "outer";
  
  function inner() {
    let innerVar = "inner";
    console.log(innerVar, outerVar, globalVar);
  }

  return inner;
}

const innerFunc = outer();
innerFunc();

setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
```

**执行流程**：
1. **全局上下文创建**：
   - 变量提升：`globalVar`、`outer`、`innerFunc`。
   - 执行同步代码，`globalVar` 赋值为 `"global"`。
2. **调用 `outer()`**：
   - 创建 `outer` 的执行上下文，`outerVar` 赋值为 `"outer"`。
   - 定义 `inner` 函数，返回 `inner`。
3. **调用 `innerFunc()`（即 `inner()`）**：
   - 创建 `inner` 的执行上下文，`innerVar` 赋值为 `"inner"`。
   - 输出 `inner outer global`。
4. **处理异步任务**：
   - `setTimeout` 回调进入宏任务队列。
   - `Promise.then` 回调进入微任务队列。
5. **事件循环**：
   - 执行微任务队列，输出 `Promise`。
   - 执行宏任务队列，输出 `Timeout`。

---

### **五、总结**
| **阶段**              | **核心机制**                                  | **关键概念**                  |
|-----------------------|---------------------------------------------|------------------------------|
| **预编译**            | 变量提升、作用域链生成                       | 执行上下文、词法作用域         |
| **同步代码执行**      | 按顺序执行代码，管理调用栈                   | 函数调用栈、闭包               |
| **异步任务处理**      | 事件循环调度宏任务和微任务                   | 任务队列、微任务优先级          |
| **内存管理**          | 标记-清除算法回收无引用对象                  | 闭包内存泄漏、弱引用（WeakMap）|

理解 JavaScript 的执行流程，能帮助你编写高效、无内存泄漏的代码，并深入掌握异步编程的核心机制（如 `Promise`、`async/await`）。