# nodejs 如何进行本地调试

在 Node.js 中进行本地调试是开发过程中定位问题、验证逻辑的关键步骤。以下是常用的调试方法和工具，覆盖从基础到进阶的场景：

---

### **1. 使用 Node.js 内置调试器**
Node.js 自带了基于命令行的调试工具，可以通过 `inspect` 参数启动。

#### 步骤：
1. **启动调试模式**：
   ```bash
   node --inspect-brk your-script.js
   ```
   - `--inspect-brk`：在代码第一行暂停，等待调试器连接。
   - 默认监听 `9229` 端口。

2. **连接调试工具**：
   - **Chrome DevTools**：打开 Chrome 浏览器，访问 `chrome://inspect`，点击 **Open dedicated DevTools for Node**。
   - **VS Code**：直接通过编辑器调试（见下文）。

---

### **2. 使用 VS Code 调试**
VS Code 是 Node.js 开发的首选工具之一，内置调试功能。

#### 步骤：
1. **创建调试配置**：
   - 在项目根目录下创建 `.vscode/launch.json` 文件（如果不存在）。
   - 按 `F5` 或点击 **Run and Debug**，选择 **Node.js**，自动生成配置。

2. **示例配置**：
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Launch Program",
         "program": "${workspaceFolder}/app.js", // 入口文件
         "skipFiles": ["<node_internals>/**"],    // 跳过 Node.js 内部文件
         "console": "integratedTerminal"          // 输出到终端
       }
     ]
   }
   ```

3. **调试操作**：
   - 设置断点：点击代码行号左侧。
   - 快捷键：
     - `F5`：启动调试。
     - `F10`：单步跳过。
     - `F11`：单步进入。
     - `Shift+F5`：停止调试。

---

### **3. 使用 `nodemon` 实现热重载**
结合 `nodemon` 监听文件变化自动重启，提升调试效率。

#### 步骤：
1. **安装 `nodemon`**：
   ```bash
   npm install -g nodemon
   ```

2. **启动调试模式**：
   ```bash
   nodemon --inspect app.js
   ```
   - 文件修改后会自动重启 Node.js 进程。

3. **结合 VS Code**：
   在 `launch.json` 中添加配置：
   ```json
   {
     "type": "node",
     "request": "attach",
     "name": "Attach to Node",
     "port": 9229,          // 默认调试端口
     "restart": true         // 支持 nodemon 自动重启
   }
   ```

---

### **4. 使用 Chrome DevTools**
通过 Chrome 的开发者工具直接调试 Node.js 代码。

#### 步骤：
1. **启动调试模式**：
   ```bash
   node --inspect app.js
   ```

2. **打开 Chrome**：
   - 访问 `chrome://inspect`。
   - 在 **Remote Target** 中找到你的 Node.js 进程，点击 **inspect**。

3. **调试功能**：
   - 断点、调用栈、变量监控、性能分析（Performance 面板）。

---

### **5. 命令行调试工具**
Node.js 提供原生命令行调试界面（适合无图形界面环境）。

#### 步骤：
1. **启动调试模式**：
   ```bash
   node inspect app.js
   ```

2. **常用命令**：
   - `cont` 或 `c`：继续执行。
   - `next` 或 `n`：单步跳过。
   - `step` 或 `s`：单步进入函数。
   - `repl`：进入交互式环境查看变量。
   - `watch('variable')`：监视变量值。

---

### **6. 调试 Docker 容器内的 Node.js 应用**
如果应用运行在 Docker 容器中，需暴露调试端口并挂载代码。

#### 步骤：
1. **修改 Dockerfile**：
   确保 Node.js 以调试模式启动：
   ```dockerfile
   CMD ["node", "--inspect=0.0.0.0:9229", "app.js"]
   ```

2. **运行容器时映射端口**：
   ```bash
   docker run -p 3000:3000 -p 9229:9229 -v $(pwd):/app your-image
   ```

3. **从本地连接调试器**：
   - 使用 VS Code 的 **Attach to Node** 配置，连接 `localhost:9229`。

---

### **7. 调试技巧与工具**
#### **（1）日志输出**
- 使用 `console.log` 快速输出变量，但避免过度依赖。
- 结构化日志工具（如 `winston`、`pino`）更适合生产环境。

#### **（2）性能分析**
- 使用 `--prof` 参数生成性能分析文件：
  ```bash
  node --prof app.js
  ```
- 分析结果：
  ```bash
  node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
  ```

#### **（3）内存泄漏检测**
- 使用 `--inspect` 结合 Chrome DevTools 的 **Memory** 面板。
- 工具：`heapdump`、`node-memwatch`。

#### **（4）异步调试**
- 使用 `async_hooks` 模块追踪异步操作：
  ```javascript
  const async_hooks = require('async_hooks');
  // 跟踪异步资源生命周期
  ```

---

### **8. 常见问题解决**
#### **（1）断点不生效**
- 确保代码版本与运行版本一致。
- 检查 VS Code 的 `sourceMap` 配置（如果使用 TypeScript/Babel）。

#### **（2）调试端口冲突**
- 指定其他端口：
  ```bash
  node --inspect=9228 app.js
  ```

#### **（3）容器内调试超时**
- 增加 VS Code 的调试超时时间（`timeout` 字段）：
  ```json
  {
    "type": "node",
    "request": "attach",
    "timeout": 30000  // 30 秒
  }
  ```

---

### **总结**
- **简单调试**：使用 `console.log` 或命令行调试。
- **高效开发**：VS Code + `nodemon` 实现热重载和断点调试。
- **复杂问题**：Chrome DevTools 分析性能、内存。
- **容器环境**：映射调试端口并挂载代码。

掌握这些方法后，可以快速定位 Node.js 应用中的逻辑错误、性能瓶颈和异步问题。