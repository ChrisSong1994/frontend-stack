# Js 代码执行中执行上下文、作用域和垃圾回收的概念

以下是 JavaScript 中 **执行上下文（Execution Context）**、**作用域（Scope）** 和 **垃圾回收（Garbage Collection）** 的详细解析，涵盖底层原理和实际应用：

---

### **一、执行上下文（Execution Context）**
#### **1. 定义**
执行上下文是 JavaScript 代码执行时的环境抽象，包含当前代码运行所需的所有信息（变量、作用域链、`this` 等）。

#### **2. 类型**
- **全局执行上下文**：代码首次运行时的默认环境，对应全局作用域。
- **函数执行上下文**：每次函数调用时创建，对应函数作用域。
- **Eval 执行上下文**：`eval` 函数内代码的执行环境（极少使用）。

#### **3. 生命周期**
每个执行上下文经历两个阶段：
- **创建阶段**：
  - 创建变量对象（**Variable Object, VO**，存储变量、函数和形参）。
  - 建立作用域链（**Scope Chain**）。
  - 确定 `this` 指向。
- **执行阶段**：
  - 变量赋值、代码执行。

#### **4. 调用栈（Call Stack）**
执行上下文按调用顺序压入栈中，遵循 **LIFO（后进先出）** 规则：
```javascript
function a() { b(); }
function b() { c(); }
function c() { console.log("执行结束"); }
a(); 
// 调用栈顺序：全局 → a() → b() → c()
// 执行完成后，栈依次弹出 c → b → a → 全局
```

---

### **二、作用域（Scope）**
#### **1. 定义**
作用域是变量和函数的可访问范围，JavaScript 采用 **词法作用域（Lexical Scope）**（静态作用域）。

#### **2. 作用域链**
- 函数定义时创建作用域链，由当前作用域和所有外层作用域组成。
- 变量查找沿作用域链向上进行，直至全局作用域。

**示例**：
```javascript
let globalVar = "global";

function outer() {
  let outerVar = "outer";
  
  function inner() {
    let innerVar = "inner";
    console.log(innerVar);    // "inner"（当前作用域）
    console.log(outerVar);    // "outer"（外层作用域）
    console.log(globalVar);   // "global"（全局作用域）
  }
  
  inner();
}

outer();
```

#### **3. 闭包（Closure）**
函数能够访问其定义时的词法作用域，即使函数在外部执行：
```javascript
function createCounter() {
  let count = 0; // 闭包保护的变量
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

---

### **三、垃圾回收（Garbage Collection）**
#### **1. 定义**
JavaScript 引擎自动管理内存，释放不再使用的内存空间。

#### **2. 核心算法**
- **标记-清除（Mark-and-Sweep）**（主流）：
  1. **标记阶段**：从根对象（全局变量、活动执行上下文）出发，标记所有可达对象。
  2. **清除阶段**：回收未被标记的对象。
  
- **引用计数（已淘汰）**：
  - 记录对象被引用的次数，归零时回收。
  - **缺陷**：无法处理循环引用。

#### **3. 内存泄漏常见场景**
- **意外的全局变量**：
  ```javascript
  function leak() {
    leakedVar = "意外全局变量"; // 未用 var/let/const 声明
  }
  ```
- **未清理的定时器或事件监听**：
  ```javascript
  const button = document.getElementById("myButton");
  button.addEventListener("click", onClick); // 未移除
  ```
- **闭包保留无用变量**：
  ```javascript
  function outer() {
    const largeData = new Array(1000000);
    return function inner() {
      // largeData 被闭包保留，即使未被使用
    };
  }
  ```

#### **4. 优化建议**
- 及时解除引用（如置为 `null`）。
- 使用弱引用（`WeakMap`/`WeakSet`）：
  ```javascript
  const weakMap = new WeakMap();
  weakMap.set(document.getElementById("id"), "data"); // 键为弱引用
  ```

---

### **四、三者的关系**
| **概念**         | **关联点**                                                                 |
|------------------|---------------------------------------------------------------------------|
| **执行上下文**   | 管理代码执行环境，包含作用域链和变量对象。                                  |
| **作用域**       | 定义变量访问规则，作用域链影响变量查找路径。                                |
| **垃圾回收**     | 通过作用域链判断变量是否可达，决定是否回收内存。                            |

---

### **五、代码示例分析**
```javascript
let globalVar = "全局";

function outer() {
  let outerVar = "外层";
  
  function inner() {
    let innerVar = "内层";
    console.log(globalVar + outerVar + innerVar);
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc(); // "全局外层内层"
```

1. **执行上下文创建**：
   - 全局上下文创建，初始化 `globalVar` 和 `outer`。
   - `outer()` 调用时创建函数上下文，初始化 `outerVar` 和 `inner`。
   - `inner()` 调用时创建函数上下文，初始化 `innerVar`。

2. **作用域链**：
   - `inner` 的作用域链：`inner → outer → global`。

3. **垃圾回收**：
   - `outer()` 执行完毕后，其执行上下文从栈弹出，但 `inner` 闭包保留了 `outerVar`，阻止其被回收。

---

### **六、总结**
- **执行上下文**：代码运行的基础环境，管理变量和作用域链。
- **作用域**：静态规则，决定变量的可见性。
- **垃圾回收**：自动内存管理，依赖作用域链判断对象可达性。

理解这些概念能帮助你写出更高效、无内存泄漏的代码，尤其在处理闭包、异步操作和大型应用时。