# vue 响应式的依赖追踪

Vue 的响应式依赖追踪通过 **数据劫持** 和 **发布-订阅模式** 实现，其核心在于 **收集数据访问的依赖关系**，并在数据变化时 **触发更新**。以下是 Vue 2 和 Vue 3 的实现原理及流程：

---

### **一、核心概念**
1. **依赖（Dependency）**：  
   指依赖某个数据的副作用（如组件的渲染函数、计算属性、侦听器等）。
2. **依赖收集（Track）**：  
   当数据被访问时，记录当前正在运行的依赖。
3. **依赖触发（Trigger）**：  
   当数据变化时，通知所有依赖该数据的副作用重新执行。

---

### **二、Vue 2：基于 `Object.defineProperty` 的依赖追踪**
#### **1. 数据结构**
- **Dep**：  
  每个响应式属性对应一个 `Dep` 实例，用于管理依赖它的 `Watcher`。
  ```javascript
  class Dep {
    constructor() {
      this.subs = []; // 存储 Watcher 实例
    }
    depend() {
      if (Dep.target) {
        this.subs.push(Dep.target); // 收集当前 Watcher
      }
    }
    notify() {
      this.subs.forEach(watcher => watcher.update()); // 触发更新
    }
  }
  ```
- **Watcher**：  
  代表一个具体的依赖（如组件的渲染函数），负责执行副作用。
  ```javascript
  class Watcher {
    constructor(vm, updateFn) {
      this.vm = vm;
      this.getter = updateFn;
      this.get(); // 首次执行，触发依赖收集
    }
    get() {
      Dep.target = this; // 标记当前 Watcher
      this.getter.call(this.vm); // 执行渲染函数，触发数据访问
      Dep.target = null; // 收集完成，重置标记
    }
    update() {
      this.get(); // 重新执行，触发视图更新
    }
  }
  ```

#### **2. 依赖收集流程**
1. **初始化响应式数据**：  
   递归遍历对象的每个属性，用 `Object.defineProperty` 定义 `getter` 和 `setter`。
   ```javascript
   function defineReactive(obj, key) {
     const dep = new Dep();
     let value = obj[key];
     Object.defineProperty(obj, key, {
       get() {
         if (Dep.target) {
           dep.depend(); // 收集当前 Watcher
         }
         return value;
       },
       set(newVal) {
         if (newVal !== value) {
           value = newVal;
           dep.notify(); // 触发更新
         }
       }
     });
   }
   ```
2. **组件渲染**：  
   创建 `Watcher` 实例，执行渲染函数。
   ```javascript
   new Watcher(vm, () => {
     renderComponent(vm); // 渲染过程中访问数据，触发 getter
   });
   ```
3. **数据访问触发依赖收集**：  
   在渲染函数中访问数据属性时，触发 `getter`，将当前 `Watcher` 存入 `Dep`。

#### **3. 数据更新触发流程**
1. **修改数据**：  
   ```javascript
   vm.data.key = 'new value'; // 触发 setter
   ```
2. **通知依赖**：  
   `setter` 调用 `dep.notify()`，遍历所有 `Watcher` 执行 `update()`。
3. **重新渲染**：  
   `Watcher.update()` 重新执行渲染函数，生成新的虚拟 DOM 并更新视图。

---

### **三、Vue 3：基于 `Proxy` 的依赖追踪**
#### **1. 数据结构**
- **Effect**：  
  代替 `Watcher`，表示一个副作用（如组件的渲染函数）。
  ```javascript
  let activeEffect; // 当前正在运行的 effect
  function effect(fn) {
    activeEffect = fn;
    fn(); // 执行副作用，触发依赖收集
    activeEffect = null;
  }
  ```
- **TargetMap**：  
  全局映射表，存储所有响应式对象与其依赖关系。
  ```javascript
  const targetMap = new WeakMap(); // key: 响应式对象, value: Map<key, Set<effect>>
  ```

#### **2. 依赖收集流程**
1. **创建响应式对象**：  
   使用 `Proxy` 代理对象，拦截 `get` 操作。
   ```javascript
   function reactive(obj) {
     return new Proxy(obj, {
       get(target, key, receiver) {
         track(target, key); // 收集依赖
         return Reflect.get(target, key, receiver);
       },
       set(target, key, value, receiver) {
         const result = Reflect.set(target, key, value, receiver);
         trigger(target, key); // 触发更新
         return result;
       }
     });
   }
   ```
2. **依赖收集（Track）**：  
   将当前 `activeEffect` 与响应式对象的属性关联。
   ```javascript
   function track(target, key) {
     if (!activeEffect) return;
     let depsMap = targetMap.get(target);
     if (!depsMap) {
       depsMap = new Map();
       targetMap.set(target, depsMap);
     }
     let dep = depsMap.get(key);
     if (!dep) {
       dep = new Set();
       depsMap.set(key, dep);
     }
     dep.add(activeEffect); // 存储当前 effect
   }
   ```
3. **组件渲染**：  
   通过 `effect` 包裹渲染函数，触发依赖收集。
   ```javascript
   effect(() => {
     renderComponent(instance); // 渲染中访问响应式数据
   });
   ```

#### **3. 数据更新触发流程**
1. **修改数据**：  
   ```javascript
   state.key = 'new value'; // 触发 Proxy 的 set 拦截
   ```
2. **触发更新（Trigger）**：  
   查找 `targetMap` 中该属性关联的所有 `effect`，重新执行。
   ```javascript
   function trigger(target, key) {
     const depsMap = targetMap.get(target);
     if (!depsMap) return;
     const effects = depsMap.get(key);
     effects && effects.forEach(effect => effect()); // 执行所有 effect
   }
   ```

---

### **四、关键差异与优化**
| **特性**               | **Vue 2**                              | **Vue 3**                              |
|------------------------|----------------------------------------|----------------------------------------|
| **劫持方式**           | `Object.defineProperty`（仅对象属性）   | `Proxy`（支持对象、数组、动态属性）      |
| **依赖存储**           | 每个属性一个 `Dep` 实例                 | 全局 `WeakMap` 按对象和 key 分层存储     |
| **嵌套对象处理**       | 初始化时递归代理                        | 懒代理（访问时递归）                    |
| **性能开销**           | 大量递归导致初始化慢                    | 按需代理，减少初始化开销                |

---

### **五、总结**
Vue 的依赖追踪通过以下步骤实现：
1. **数据劫持**：  
   - Vue 2：通过 `Object.defineProperty` 劫持属性访问。  
   - Vue 3：通过 `Proxy` 代理整个对象。
2. **依赖收集**：  
   在数据被访问时（`get` 操作），记录当前正在运行的副作用（`Watcher` 或 `Effect`）。
3. **依赖触发**：  
   在数据被修改时（`set` 操作），通知所有关联的副作用重新执行。

**Vue 3 的优势**：
- 支持动态属性、数组索引的直接监听。
- 依赖存储结构更高效，减少内存占用。
- 懒代理机制优化初始化性能。

理解这一机制有助于：
- 避免响应式数据操作中的常见错误（如直接修改数组索引）。
- 优化大型应用的性能（如减少不必要的深度响应式转换）。