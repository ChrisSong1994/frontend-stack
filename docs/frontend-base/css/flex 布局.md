# Flex 布局

Flex 布局（弹性盒子布局）是一种用于高效构建一维布局的 CSS 模块，通过简洁的代码实现复杂的排列方式。以下是完整的 Flex 布局详解：

---

### 一、基本概念
| 术语         | 描述                                                                 |
|--------------|----------------------------------------------------------------------|
| **Flex容器** | 设置 `display: flex` 或 `display: inline-flex` 的元素                |
| **Flex项目** | Flex容器内的**直接子元素**（不包括子元素的子元素）                   |
| **主轴**     | 项目的排列方向轴（由 `flex-direction` 定义）                         |
| **交叉轴**   | 与主轴垂直的轴                                                      |

---

### 二、Flex容器属性
以下属性需设置在 **容器元素** 上：

#### 1. `flex-direction`：主轴方向
```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```
| 值              | 效果                                 |
|-----------------|--------------------------------------|
| `row` (默认)    | 水平排列，从左到右                   |
| `row-reverse`   | 水平排列，从右到左                   |
| `column`        | 垂直排列，从上到下                   |
| `column-reverse`| 垂直排列，从下到上                   |

#### 2. `flex-wrap`：换行方式
```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```
| 值              | 效果                                 |
|-----------------|--------------------------------------|
| `nowrap` (默认) | 单行排列，项目可能被压缩             |
| `wrap`          | 多行排列，从上到下                   |
| `wrap-reverse`  | 多行排列，从下到上                   |

#### 3. `justify-content`：主轴对齐
```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```
| 值              | 效果                                 |
|-----------------|--------------------------------------|
| `flex-start`    | 向主轴起点对齐                       |
| `flex-end`      | 向主轴终点对齐                       |
| `center`        | 居中对齐                             |
| `space-between` | 两端对齐，项目间隔相等               |
| `space-around`  | 项目两侧间隔相等（边缘间隔为中间一半）|
| `space-evenly`  | 所有间隔完全相等                     |

#### 4. `align-items`：交叉轴对齐（单行）
```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline;
}
```
| 值              | 效果                                 |
|-----------------|--------------------------------------|
| `stretch` (默认)| 拉伸填满容器高度                     |
| `flex-start`    | 向交叉轴起点对齐                     |
| `flex-end`      | 向交叉轴终点对齐                     |
| `center`        | 居中对齐                             |
| `baseline`      | 按项目第一行文字基线对齐             |

#### 5. `align-content`：交叉轴对齐（多行）
```css
.container {
  align-content: stretch | flex-start | flex-end | center | space-between | space-around;
}
```
*仅在多行布局时生效，属性值与 `justify-content` 类似*

---

### 三、Flex项目属性
以下属性需设置在 **项目元素** 上：

#### 1. `order`：排列顺序
```css
.item {
  order: <integer>; /* 默认0，数值越小越靠前 */
}
```

#### 2. `flex-grow`：放大比例
```css
.item {
  flex-grow: <number>; /* 默认0（不放大） */
}
```
*按比例分配剩余空间*

#### 3. `flex-shrink`：收缩比例
```css
.item {
  flex-shrink: <number>; /* 默认1（可收缩） */
}
```
*按比例收缩溢出空间（设置为0可禁止收缩）*

#### 4. `flex-basis`：初始大小
```css
.item {
  flex-basis: <length> | auto; /* 默认auto */
}
```
*定义项目在分配空间前的基准尺寸*

#### 5. `flex`：复合属性
```css
.item {
  flex: none | [ <flex-grow> <flex-shrink>? || <flex-basis> ];
}
```
| 简写形式         | 等价值                     |
|------------------|----------------------------|
| `flex: 1`        | `1 1 0%`                   |
| `flex: auto`     | `1 1 auto`                 |
| `flex: none`     | `0 0 auto`                 |
| `flex: 0 1 200px`| 收缩允许，基准200px，不放大|

#### 6. `align-self`：覆盖容器对齐
```css
.item {
  align-self: auto | stretch | flex-start | flex-end | center | baseline;
}
```
*单独设置某个项目的交叉轴对齐方式*

---

### 四、核心应用场景
#### 1. 水平垂直居中
```css
.container {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center;     /* 交叉轴居中 */
}
```

#### 2. 等分导航栏
```html
<nav class="menu">
  <div>首页</div>
  <div>产品</div>
  <div>关于</div>
</nav>

<style>
.menu {
  display: flex;
}
.menu div {
  flex: 1; /* 等分空间 */
  text-align: center;
}
</style>
```

#### 3. 圣杯布局
```css
.container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.main-content {
  flex: 1; /* 填充剩余空间 */
}
```

---

### 五、常见问题与解决方案
| 问题现象                | 原因分析               | 解决方案                      |
|-------------------------|------------------------|-------------------------------|
| 项目宽度超出容器        | `flex-shrink` 未生效   | 检查是否设置 `flex-shrink: 0` |
| 垂直方向未填满容器      | `align-items` 默认为拉伸 | 确认容器高度是否明确指定       |
| 多行布局对齐异常        | 错误使用 `align-items`  | 改用 `align-content`          |
| 内容溢出导致布局错乱    | `flex-basis` 设置不当   | 使用 `min-width` 约束最小尺寸 |

---

### 六、Flex布局 vs Grid布局
| 特性               | Flex布局                       | Grid布局                     |
|--------------------|--------------------------------|------------------------------|
| **维度**           | 一维布局（主轴方向）           | 二维布局（行与列）           |
| **适用场景**       | 线性排列、内容动态             | 复杂网格结构、固定布局       |
| **控制粒度**       | 项目级控制                     | 容器级与项目级双重控制       |
| **代码复杂度**     | 简单直观                       | 需要定义行列模板             |

---

### 七、浏览器兼容性
- 现代浏览器全面支持（需加前缀 `-webkit-` 的浏览器已极少）
- IE10/11 部分支持（需使用旧语法 `-ms-flex`）

---

通过灵活组合这些属性，可以轻松实现各种复杂布局，同时保持代码简洁易维护。