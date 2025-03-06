# Path 路径

以下是 Node.js 中 `path` 模块的详细介绍及示例代码。该模块专门用于处理文件路径的跨平台兼容性，确保代码在不同操作系统（Windows、Linux、macOS）下正确运行。

### **1. 核心功能**
| 方法名                 | 作用                                 | 跨平台兼容性 |
|-----------------------|--------------------------------------|--------------|
| `path.join()`         | 拼接路径片段                          | ✔️           |
| `path.resolve()`      | 解析绝对路径                          | ✔️           |
| `path.parse()`        | 解析路径为对象                        | ✔️           |
| `path.format()`       | 从对象构造路径                        | ✔️           |
| `path.basename()`     | 获取文件名（含扩展名）                 | ✔️           |
| `path.dirname()`      | 获取目录路径                          | ✔️           |
| `path.extname()`      | 获取文件扩展名                         | ✔️           |
| `path.normalize()`    | 规范化路径（处理 `..`、`.` 和斜杠）    | ✔️           |
| `path.relative()`     | 计算两个路径的相对关系                 | ✔️           |
| `path.isAbsolute()`   | 判断是否为绝对路径                     | ✔️           |
| `path.sep`            | 操作系统路径分隔符（`\` 或 `/`）       | ✔️           |

### **2. 示例代码**

#### **2.1 路径拼接：`path.join()`**
```javascript
const path = require('path');

// 拼接路径（自动处理分隔符）
const fullPath = path.join('src', 'assets', '../images', 'logo.png');
console.log(fullPath);
// Windows: 'src\images\logo.png'
// Linux/macOS: 'src/images/logo.png'
```

#### **2.2 解析绝对路径：`path.resolve()`**
```javascript
const absolutePath = path.resolve('src', 'config', 'app.json');
console.log(absolutePath);
// 输出（假设当前目录是 /projects/demo）：
// '/projects/demo/src/config/app.json'
```

#### **2.3 解析路径对象：`path.parse()`**
```javascript
const parsed = path.parse('/home/user/docs/report.pdf');
console.log(parsed);
// 输出：
// {
//   root: '/',
//   dir: '/home/user/docs',
//   base: 'report.pdf',
//   ext: '.pdf',
//   name: 'report'
// }
```

#### **2.4 构造路径：`path.format()`**
```javascript
const obj = {
  dir: 'C:\\projects',
  name: 'app',
  ext: '.js'
};
const formattedPath = path.format(obj);
console.log(formattedPath); // 'C:\projects\app.js'
```

#### **2.5 获取路径片段**
```javascript
const filePath = '/var/www/index.html';

// 获取文件名（含扩展名）
console.log(path.basename(filePath)); // 'index.html'

// 获取目录名
console.log(path.dirname(filePath)); // '/var/www'

// 获取扩展名
console.log(path.extname(filePath)); // '.html'
```

#### **2.6 路径规范化：`path.normalize()`**
```javascript
const messyPath = 'src//./assets/../images///logo.png';
const cleanPath = path.normalize(messyPath);
console.log(cleanPath);
// Windows: 'src\images\logo.png'
// Linux/macOS: 'src/images/logo.png'
```

#### **2.7 计算相对路径：`path.relative()`**
```javascript
const from = '/home/user/docs';
const to = '/home/user/images/photo.jpg';
const relativePath = path.relative(from, to);
console.log(relativePath); // '../images/photo.jpg'
```

#### **2.8 判断绝对路径：`path.isAbsolute()`**
```javascript
console.log(path.isAbsolute('/var/www')); // true（Linux/macOS）
console.log(path.isAbsolute('C:\\Windows')); // true（Windows）
console.log(path.isAbsolute('src/config')); // false
```

### **3. 跨平台注意事项**
#### **3.1 路径分隔符**
```javascript
// 获取当前系统的路径分隔符
console.log(path.sep); 
// Windows: '\'
// Linux/macOS: '/'

// 示例：分割路径
const parts = 'src/images/logo.png'.split(path.sep);
console.log(parts); 
// Windows: ['src', 'images', 'logo.png']
// Linux/macOS: ['src', 'images', 'logo.png']
```

#### **3.2 文件名保留字符**
- Windows 不允许文件名包含 `*`, `?`, `"`, `<`, `>`, `|` 等字符。
- 使用 `path` 模块的方法可自动处理操作系统限制。

### **4. 实用场景**
#### **场景 1：动态加载配置文件**
```javascript
const configPath = path.join(__dirname, 'config', 'app.json');
const config = require(configPath);
```

#### **场景 2：处理用户上传文件路径**
```javascript
function saveUpload(file) {
  const uploadDir = path.resolve('./uploads');
  const filename = `${Date.now()}_${file.originalname}`;
  const filePath = path.join(uploadDir, filename);
  // 保存文件到 filePath
}
```

#### **场景 3：构建静态资源 URL**
```javascript
const staticBase = 'https://cdn.example.com/assets';
const imagePath = path.join('images', 'products', 'phone.jpg');
const imageUrl = new URL(imagePath, staticBase).href;
// 输出：'https://cdn.example.com/assets/images/products/phone.jpg'
```

### **5. 总结**
- **跨平台兼容性**：`path` 模块自动处理不同操作系统的路径差异。
- **代码可维护性**：避免手动拼接字符串，减少错误。
- **安全性**：防止路径遍历攻击（如 `path.join()` 自动处理 `..`）。

使用 `path` 模块能显著提升代码的健壮性和可移植性，是 Node.js 文件操作的核心工具。