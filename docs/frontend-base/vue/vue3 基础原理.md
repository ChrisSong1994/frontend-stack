# vue3 基础原理

Vue 3 的基础原理可以归纳为以下几个关键点，每个部分都针对性能、灵活性和开发体验进行了优化：

---

### **1. 响应式系统：基于 Proxy 的依赖追踪**

- **Proxy 替代 Object.defineProperty**：  
  Vue 3 使用 ES6 的 `Proxy` 实现响应式数据，解决了 Vue 2 无法检测对象属性新增/删除、数组索引修改等问题。`Proxy` 可以拦截对象的 13 种操作（如 `get`、`set`、`deleteProperty` 等），实现细粒度的依赖跟踪。
- **依赖收集与触发**：
  - **`track` 与 `trigger`**：  
    当数据被访问时，`track` 函数收集当前运行的副作用（如组件的渲染函数）；当数据修改时，`trigger` 函数触发这些副作用的重新执行。
  - **`effect` 副作用封装**：  
    副作用（如组件的渲染、计算属性）被封装为 `effect` 函数，通过响应式系统自动管理依赖。

---

### **2. 编译器优化：更高效的虚拟 DOM**

- **静态提升（Static Hoisting）**：  
  模板中的静态节点（无动态绑定的部分）会被提取为常量，避免重复创建。
- **补丁标志（Patch Flags）**：  
  在虚拟 DOM 节点上标记动态绑定的类型（如 `CLASS`、`STYLE`、`PROPS`），在 `diff` 时仅对比动态部分，跳过静态内容。
- **Block Tree 优化**：  
  将动态节点按结构划分为“块”（Block），减少父子组件嵌套时的冗余对比。

---

### **3. Composition API：逻辑复用与组织**

- **`setup` 函数**：  
  替代 Vue 2 的 `data`、`methods` 等选项，允许通过 `ref` 和 `reactive` 创建响应式变量，并通过函数组合逻辑。
- **逻辑复用**：  
  通过自定义 Hook（如 `useFetch`）封装可复用的逻辑，解决 Mixin 的命名冲突和来源不清晰问题。
- **生命周期钩子函数化**：  
  使用 `onMounted`、`onUpdated` 等函数注册生命周期钩子，更灵活地管理副作用。

---

### **4. 模块化架构与 Tree-shaking**

- **按需引入**：  
  Vue 3 将核心功能（如响应式、虚拟 DOM、编译器）拆分为独立模块（如 `@vue/reactivity`），支持按需引入。
- **Tree-shaking 友好**：  
  未使用的 API（如 `v-model` 修饰符、过渡组件）不会被打包，减少生产环境体积。

---

### **5. 新特性与 TypeScript 支持**

- **Fragment 与 Teleport**：
  - `<Fragment>` 支持多根节点，避免不必要的包裹元素。
  - `<Teleport>` 允许将子组件渲染到 DOM 的任意位置（如弹窗）。
- **Suspense 异步组件**：  
  提供 `<Suspense>` 组件处理异步依赖（如异步组件、`async setup()`）的加载状态。
- **TypeScript 重构**：  
  代码库完全用 TypeScript 重写，提供更完善的类型推导和 IDE 支持。

---

### **6. 性能优化**

- **响应式系统性能提升**：  
  Proxy 的性能优于 `Object.defineProperty`，且依赖追踪更精准。
- **虚拟 DOM 优化**：  
  通过编译时优化（如静态提升）和运行时优化（补丁标志）减少 CPU 开销。
- **服务端渲染（SSR）改进**：  
  支持流式渲染和更高效的客户端激活（Hydration）。

---

### **总结**

Vue 3 通过 **Proxy 响应式系统**、**编译器优化的虚拟 DOM**、**Composition API** 和 **模块化架构** 实现了更高效的渲染、更灵活的代码组织，以及更小的包体积。同时，TypeScript 支持和新特性（如 Fragment、Teleport）进一步提升了开发体验。这些改进使其在复杂应用和高性能场景中表现更出色。
