# vue3 通过 proxy 进行对象类型深度监听
Vue 3 通过 **Proxy** 和 **递归响应式转换** 实现对象和复杂类型的深度监听，其核心在于 **懒代理（Lazy Proxy）** 和 **嵌套对象自动响应化**。以下是详细机制：

---

### **1. Proxy 基本拦截**
Vue 3 使用 `Proxy` 包装目标对象，拦截其属性的 **读取（get）** 和 **写入（set）** 操作：
```javascript
const reactive = (target) => new Proxy(target, {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    track(target, key); // 依赖收集
    // 深度响应化：若属性值是对象，递归代理
    return isObject(res) ? reactive(res) : res;
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);
    // 触发更新（需判断值是否变化，避免重复触发）
    if (hasChanged(value, oldValue)) {
      trigger(target, key);
    }
    return result;
  }
});
```

---

### **2. 深度监听的实现**
#### **(1) 懒代理（Lazy Proxy）**
- **触发时机**：仅在访问对象属性时，才对嵌套对象进行响应式转换。  
- **优势**：避免初始化时递归整个对象树，减少性能开销。

**示例**：
```javascript
const data = { a: { b: 1 } };
const proxyData = reactive(data);

// 访问 proxyData.a 时，才会对 { b: 1 } 创建 Proxy
console.log(proxyData.a.b); // 触发 getter，递归代理 { b: 1 }
```

#### **(2) 嵌套对象自动响应化**
- **递归检测**：在 `get` 拦截中，若读取的值是对象（`Object` 或 `Array`），自动返回其响应式代理。
- **缓存机制**：通过 `WeakMap` 缓存已代理对象，避免重复代理。
  ```javascript
  const reactiveMap = new WeakMap();

  function reactive(target) {
    if (reactiveMap.has(target)) {
      return reactiveMap.get(target);
    }
    const proxy = new Proxy(target, handlers);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  ```

---

### **3. 数组的特殊处理**
#### **(1) 拦截数组方法**
重写 `push`、`pop` 等变异方法，确保新增元素被响应式处理：
```javascript
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'splice'].forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args; // 新增元素
        break;
      case 'splice':
        inserted = args.slice(2); // splice 新增的元素
        break;
    }
    if (inserted) ob.observeArray(inserted); // 响应化新增元素
    ob.dep.notify(); // 触发更新
    return result;
  };
});

// 数组响应式处理
function observeArray(items) {
  for (let i = 0; i < items.length; i++) {
    observe(items[i]); // 递归响应化每个元素
  }
}
```

#### **(2) 索引和 length 的监听**
- **Proxy 直接支持**：通过 `set` 拦截器监听索引赋值和 `length` 变化，无需特殊处理。
  ```javascript
  const arr = reactive([1, 2]);
  arr[2] = 3; // 触发 set 拦截
  arr.length = 0; // 触发 set 拦截
  ```

---

### **4. 循环引用与边界情况**
#### **(1) 循环引用处理**
- **缓存代理对象**：通过 `WeakMap` 避免重复代理同一对象，防止无限递归。
  ```javascript
  const obj = { self: null };
  obj.self = obj; // 循环引用
  const proxyObj = reactive(obj); // 不会栈溢出
  ```

#### **(2) 原始值与非响应式对象**
- **原始值（Primitive）**：如字符串、数字，无法被 Proxy 代理，需用 `ref` 包裹。
- **跳过代理**：使用 `markRaw` 标记对象，阻止其被响应式转换。
  ```javascript
  import { markRaw, reactive } from 'vue';
  const rawObj = markRaw({ data: '不可响应' });
  const proxyData = reactive({ nested: rawObj }); // nested 不会被代理
  ```

---

### **5. 性能优化**
- **按需响应化**：仅在访问属性时创建嵌套代理，减少初始化开销。
- **扁平化响应式结构**：避免深层嵌套对象，使用 `shallowReactive` 仅代理顶层属性。
  ```javascript
  import { shallowReactive } from 'vue';
  const data = shallowReactive({ a: { b: 1 } });
  data.a.b = 2; // 修改 a.b 不会触发更新（a 未被深度代理）
  ```

---

### **对比 Vue 2 的深度监听**
| **特性**               | **Vue 2（Object.defineProperty）**      | **Vue 3（Proxy）**                     |
|------------------------|----------------------------------------|----------------------------------------|
| **嵌套对象监听**        | 初始化时递归遍历所有属性               | 按需懒代理，访问时递归                 |
| **动态新增属性**        | 需 `Vue.set`                           | 直接赋值自动响应化                     |
| **数组监听**           | 重写数组方法，无法监听索引和 `length`  | 支持索引和 `length` 变化               |
| **循环引用处理**        | 可能栈溢出                             | 通过 `WeakMap` 缓存安全处理            |

---

### **总结**
Vue 3 的深度监听通过 **Proxy 动态代理** 和 **递归懒响应化** 实现：
1. **懒代理机制**：仅在访问属性时递归转换嵌套对象，优化性能。
2. **数组方法重写**：确保变异方法触发更新，并响应化新增元素。
3. **缓存与循环处理**：通过 `WeakMap` 避免重复代理和循环引用问题。
4. **边界处理**：支持 `markRaw` 和 `shallowReactive` 控制响应式层级。

这种设计使得 Vue 3 在处理复杂对象时更高效、灵活，同时减少开发者的心智负担。