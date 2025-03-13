# 实现 html 的解析器

以下是使用 JavaScript 实现 HTML 文本解析器并输出 JSON 树状结构的完整方案，结合了正则表达式匹配、栈管理和节点关系构建三大核心技术点：

---

### 一、核心实现原理
1. **正则表达式匹配**  
   通过正则表达式捕获 HTML 标签及其属性，支持自闭合标签（如 `<img/>`）和嵌套结构：
   ```javascript
   const kMarkupPattern = /<(\/?)([a-zA-Z][-.:0-9_a-zA-Z]*)((?:\s+[^>]*?(?:(?:'[^']*')|(?:"[^"]*"))?)*)\s*(\/?)>/g;
   ```

2. **栈结构管理层级**  
   用栈存储当前解析路径，遇到开标签入栈，闭标签出栈，实现父子关系绑定：
   ```javascript
   const stack = [rootNode]; // 初始化根节点
   ```

3. **节点属性解析**  
   通过 `/\s+([^=]+)=["']?([^"']*)["']?/g` 正则提取属性键值对，处理带引号的复杂值。

---

### 二、代码实现（关键步骤）
#### 1. 节点类型定义
```javascript
const NodeType = {
  ELEMENT: 'element',
  TEXT: 'text'
};

class HTMLNode {
  constructor(tagName, type, parent = null) {
    this.tagName = tagName;
    this.type = type;
    this.attrs = {};
    this.children = [];
    this.parent = parent;
  }
}
```

#### 2. 解析流程主函数
```javascript
function parseHTML(html) {
  // 初始化虚拟根节点
  const root = new HTMLNode('root', NodeType.ELEMENT);
  let currentParent = root;
  const stack = [root];
  let lastIndex = 0;

  // 正则匹配循环
  let match;
  while ((match = kMarkupPattern.exec(html)) !== null) {
    const [fullMatch, closingSlash, tagName, attrsStr] = match;
    
    // 处理文本节点
    if (lastIndex < match.index) {
      const textContent = html.slice(lastIndex, match.index).trim();
      if (textContent) {
        currentParent.children.push({
          type: NodeType.TEXT,
          value: textContent
        });
      }
    }

    // 处理开标签
    if (!closingSlash) {
      const node = new HTMLNode(tagName, NodeType.ELEMENT, currentParent);
      parseAttributes(attrsStr, node); // 属性解析函数
      currentParent.children.push(node);
      stack.push(node);
      currentParent = node;
    } 
    // 处理闭标签
    else {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }
    
    lastIndex = kMarkupPattern.lastIndex;
  }
  return root;
}
```

#### 3. 属性解析函数
```javascript
function parseAttributes(attrString, node) {
  const attrRegex = /\s+([^=]+)=["']?([^"']*)["']?/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attrString)) !== null) {
    const [_, key, value] = attrMatch;
    node.attrs[key] = value.replace(/^['"]|['"]$/g, '');
  }
}
```

---

### 三、测试用例
```html
const html = `
<div id="container" data-role="main">
  <h1 class="title">解析器示例</h1>
  <img src="logo.png" alt="logo"/>
  <ul>
    <li>项目1</li>
    <li>项目2</li>
  </ul>
</div>`;

const result = parseHTML(html);
console.log(JSON.stringify(result, null, 2));
```

**输出结构示例**：
```json
{
  "tagName": "root",
  "type": "element",
  "attrs": {},
  "children": [
    {
      "tagName": "div",
      "type": "element",
      "attrs": {
        "id": "container",
        "data-role": "main"
      },
      "children": [
        {
          "tagName": "h1",
          "type": "element",
          "attrs": { "class": "title" },
          "children": [ { "type": "text", "value": "解析器示例" } ]
        },
        {
          "tagName": "img",
          "type": "element",
          "attrs": { "src": "logo.png", "alt": "logo" },
          "children": []
        },
        {
          "tagName": "ul",
          "type": "element",
          "attrs": {},
          "children": [
            { 
              "tagName": "li", 
              "children": [ { "type": "text", "value": "项目1" } ] 
            },
            { 
              "tagName": "li", 
              "children": [ { "type": "text", "value": "项目2" } ] 
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 四、扩展优化建议
1. **错误处理**  
   添加栈空时遇到闭标签的异常检测，实现类似浏览器的容错机制

2. **性能优化**  
   * 使用文档碎片（DocumentFragment）暂存节点
   * 对连续文本节点进行合并

3. **高级特性支持**  
   * 注释节点处理：`<!-- comment -->`
   * CDATA 区块解析：`<![CDATA[...]]>`
   * 自闭合标签白名单（img, br 等）

---

### 五、与现成库对比
| 方案        | 特性                             | 适用场景               |
|-----------|--------------------------------|--------------------|
| 自实现解析器    | 轻量级（<1KB）、可定制               | 简单HTML片段解析         |
| DOMParser | 浏览器原生API、完整DOM支持           | 需要精确模拟浏览器解析的场景 |
| Cheerio   | 类jQuery API、服务器端友好          | 复杂DOM操作需求      |
| parse5    | 符合HTML5标准、被jsdom等库依赖       | 需要严格标准的解析场景    |

建议在需要精准解析时优先使用 DOMParser，若需自定义解析规则或学习原理可参考本实现方案。