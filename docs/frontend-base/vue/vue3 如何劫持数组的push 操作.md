# vue3 如何劫持数组的push 操作

Vue 3 通过 **Proxy 代理**和**数组方法的重写**结合的方式实现对数组 `push` 操作的劫持。具体实现步骤如下：

---

### **1. Proxy 代理数组对象**
Vue 3 的响应式系统使用 `Proxy` 包装原始数组，拦截数组的读写操作：
```javascript
const rawArray = [1, 2, 3];
const proxyArray = new Proxy(rawArray, {
  get(target, key, receiver) {
    // 依赖收集
    track(target, key);
    // 返回属性值（如果是方法，返回重写后的方法）
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    // 触发更新
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return result;
  }
});
```

---

### **2. 重写数组的 `push` 方法**
当访问数组的 `push` 方法时，Vue 3 会返回一个 **重写后的方法**，核心逻辑如下：

#### **(1) 重写逻辑**
```javascript
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    // 1. 执行原始方法
    const result = original.apply(this, args);
    // 2. 获取数组的 Observer 实例（存储依赖）
    const ob = this.__ob__;
    // 3. 手动触发更新（新增元素需要劫持）
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args; // 新增的元素
        break;
      case 'splice':
        inserted = args.slice(2); // splice(start, deleteCount, ...items)
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // 4. 通知依赖更新
    ob.dep.notify();
    return result;
  };
});
```

#### **(2) 替换数组的原型链**
将代理后的数组方法挂载到响应式数组的原型链上：
```javascript
function createReactiveArray(arr) {
  arr.__proto__ = arrayMethods; // 修改原型链
  return new Proxy(arr, baseHandlers); // 再用 Proxy 包装
}
```

---

### **3. 依赖收集与触发更新**
- **依赖收集（`track`）**：  
  当访问数组元素或 `length` 属性时，通过 `Proxy` 的 `get` 陷阱收集依赖。
- **触发更新（`trigger`）**：  
  调用 `push` 等变异方法后，手动调用 `ob.dep.notify()` 通知所有依赖。

---

### **4. 对新增元素的响应式处理**
当 `push` 添加新元素时，Vue 3 会递归将新元素转为响应式：
```javascript
// Observer 类的 observeArray 方法
observeArray(items) {
  for (let i = 0; i < items.length; i++) {
    observe(items[i]); // 递归劫持数组元素
  }
}
```

---

### **总结**
Vue 3 劫持数组 `push` 操作的完整流程：
1. **Proxy 代理数组**：拦截数组的读写操作，自动收集依赖。
2. **重写数组方法**：替换 `push` 等方法，执行后手动触发更新。
3. **递归响应化新增元素**：确保新元素也是响应式的。
4. **依赖通知**：通过 `dep.notify()` 触发组件重新渲染。

**对比 Vue 2**：
- **Vue 2**：直接重写数组原型方法，无法监听索引操作。
- **Vue 3**：结合 `Proxy` 和原型链重写，既能监听方法调用，也能拦截索引和 `length` 变化，实现更全面的响应式。