# :root 的使用

在CSS中，`:root` 是一个**伪类选择器**，用于匹配文档的根元素。以下是其核心要点及用法详解：

---

### **1. 指向的根元素**
• **在HTML文档中**：`:root` 对应的是 `<html>` 元素，即HTML的根标签。  
  因此，在HTML中，`:root` 与 `html` 选择器效果相同。
• **在其他文档类型中**（如SVG、XML）：`:root` 会指向该类型文档的根元素。

---

### **2. 与 `html` 选择器的区别**
虽然两者在HTML中效果相同，但存在以下差异：
| **特性**       | **`:root`**                     | **`html`**                  |
|----------------|---------------------------------|-----------------------------|
| **语义**       | 明确表示文档的根元素（通用性）  | 仅针对HTML的根元素          |
| **优先级**     | 同类型选择器（伪类 vs 元素）    | 元素选择器                  |
| **适用场景**   | 跨文档类型（如SVG）              | 仅HTML                      |

---

### **3. 核心用途**
#### **(1) 定义全局CSS变量（自定义属性）**
`:root` 是声明全局CSS变量的最佳位置，这些变量可在整个文档中复用：
```css
:root {
  --primary-color: #3498db;   /* 定义主色调变量 */
  --max-width: 1200px;       /* 定义布局最大宽度 */
}

.element {
  color: var(--primary-color);  /* 使用变量 */
  max-width: var(--max-width);
}
```

#### **(2) 设置全局样式**
为根元素统一设置影响全局的样式（如字体、背景）：
```css
:root {
  font-family: "Arial", sans-serif;  /* 全局字体 */
  background: #f0f0f0;               /* 页面背景色 */
}
```

#### **(3) 主题切换支持**
通过JavaScript动态修改 `:root` 中的变量，实现主题切换：
```javascript
// 修改CSS变量值
document.documentElement.style.setProperty('--primary-color', '#e74c3c');
```

---

### **4. 优先级规则**
• **当 `:root` 与 `html` 的样式冲突时**，两者优先级相同，遵循**代码顺序原则**（后定义的生效）。
• **与其他选择器的优先级对比**：
  ```css
  :root { color: blue; }    /* 优先级权重：0-1-0（伪类） */
  html { color: red; }      /* 优先级权重：0-0-1（元素） */
  body { color: green; }   /* 权重0-0-1，但继承自根元素 */
  ```
  最终文本颜色取决于具体元素的样式及继承关系。

---

### **5. 浏览器兼容性**
• **支持所有现代浏览器**（Chrome、Firefox、Safari、Edge）。
• **不支持IE 8及以下版本**，但可通过Polyfill（如[css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill)）实现兼容。

---

### **6. 实际应用示例**
#### **响应式布局中的变量调整**
```css
:root {
  --padding: 15px;
}

@media (min-width: 768px) {
  :root {
    --padding: 30px;  /* 大屏幕增加内边距 */
  }
}

.container {
  padding: var(--padding);
}
```

#### **暗黑模式切换**
```css
:root {
  --bg-color: #fff;
  --text-color: #333;
}

[data-theme="dark"] {
  --bg-color: #2c3e50;
  --text-color: #ecf0f1;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}
```
通过切换 `<html>` 的 `data-theme` 属性，即可实现主题变化。

---

### **总结**
`:root` 是CSS中用于定义全局样式和变量的关键选择器，尤其在以下场景中不可或缺：
• **主题管理**：集中控制颜色、尺寸等设计系统参数。
• **代码复用**：通过变量减少重复代码，提升可维护性。
• **动态样式**：结合JavaScript实现运行时样式切换。