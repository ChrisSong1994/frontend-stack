# nodejs 如何调用 c、c++底层模块

Node.js 调用 C/C++ 底层模块主要有 **4 种主流方案**，每种方案在开发效率、性能、适用场景等方面各有优劣。以下是综合多个技术文档的深度解析：

---

### 一、Node-Addon-API（官方原生方案）
**推荐场景**：高性能扩展开发、需要深度集成 Node.js 特性  
**实现步骤**：  
1. **环境准备**  
   ```bash
   npm install -g node-gyp  # 编译工具
   npm install node-addon-api  # 官方 C++ 扩展开发库
   ```

2. **编写 C++ 模块**（示例：加法函数）  
   ```cpp
   // addon.cc
   #include <napi.h>
   Napi::Value Add(const Napi::CallbackInfo& info) {
     Napi::Env env = info.Env();
     double a = info[0].As<Napi::Number>().DoubleValue();
     double b = info[1].As<Napi::Number>().DoubleValue();
     return Napi::Number::New(env, a + b);
   }
   Napi::Object Init(Napi::Env env, Napi::Object exports) {
     exports.Set("add", Napi::Function::New(env, Add));
     return exports;
   }
   NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
   ```

3. **配置编译文件**  
   ```json
   // binding.gyp
   {
     "targets": [
       {
         "target_name": "addon",
         "sources": ["addon.cc"],
         "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
         "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
       }
     ]
   }
   ```

4. **编译与调用**  
   ```bash
   node-gyp configure && node-gyp build  # 生成 addon.node
   ```
   ```javascript
   // test.js
   const addon = require('./build/Release/addon.node');
   console.log(addon.add(3, 5));  // 输出 8
   ```

**优势**：  
• 原生支持 V8 引擎，性能最佳  
• 可访问 Node.js 核心 API（如事件循环、Buffer）  
• 支持异步操作（通过 `Napi::AsyncWorker`）  

**局限**：  
• 需处理 C++ 内存管理  
• 跨平台编译需配置不同工具链（Windows 需 Visual Studio Build Tools）  

---

### 二、FFI（Foreign Function Interface）
**推荐场景**：快速调用现有 C 动态库（*.dll / *.so）  
**实现步骤**：  
1. **安装依赖**  
   ```bash
   npm install ffi-napi ref-napi  # FFI 核心库和类型映射库
   ```

2. **编译 C 动态库**  
   ```c
   // libmath.c
   int add(int a, int b) { return a + b; }
   ```
   ```bash
   gcc -shared -o libmath.so -fPIC libmath.c  # Linux
   cl /LD libmath.c  # Windows（生成 libmath.dll）
   ```

3. **Node.js 调用**  
   ```javascript
   const ffi = require('ffi-napi');
   const libmath = ffi.Library('./libmath', {
     'add': ['int', ['int', 'int']]
   });
   console.log(libmath.add(3, 5));  // 输出 8
   ```

**优势**：  
• 无需编译 C++ 扩展，快速集成现有库  
• 支持复杂数据结构（通过 `ref-struct` 处理结构体）  

**局限**：  
• 性能低于原生扩展（存在 JS/C 边界转换开销）  
• 类型映射需手动处理（易引发内存错误）  

---

### 三、WebAssembly（跨平台方案）
**推荐场景**：跨浏览器/Node.js 复用 C/C++ 代码  
**实现步骤**：  
1. **安装 Emscripten 编译器**  
   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk && ./emsdk install latest && ./emsdk activate latest
   ```

2. **编译 C 代码为 WASM**  
   ```c
   // math.c
   #include <emscripten.h>
   EMSCRIPTEN_KEEPALIVE
   int add(int a, int b) { return a + b; }
   ```
   ```bash
   emcc math.c -o math.js -s WASM=1 -s EXPORTED_FUNCTIONS="['_add']"
   ```

3. **Node.js 调用**  
   ```javascript
   const Module = require('./math.js');
   Module.onRuntimeInitialized = () => {
     console.log(Module._add(3, 5));  // 输出 8
   };
   ```

**优势**：  
• 代码可跨浏览器和 Node.js 运行  
• 沙箱隔离提升安全性  

**局限**：  
• 无法直接访问 Node.js API（如文件系统）  
• 内存管理需通过 WASM 堆操作  

---

### 四、Child Process（进程间通信）
**推荐场景**：调用独立 C/C++ 可执行文件  
**实现示例**：  
```javascript
const { exec } = require('child_process');
exec('./math 3 5', (err, stdout) => {
  console.log(stdout);  // 输出 8
});
```

**优势**：  
• 零学习成本，适合简单脚本调用  
• 进程隔离提升稳定性  

**局限**：  
• 频繁调用时进程创建开销大  
• 数据交互需通过 STDIO（性能瓶颈）  

---

### 五、方案选型建议
| 维度             | Node-Addon-API   | FFI              | WebAssembly      | Child Process    |
|------------------|------------------|------------------|------------------|------------------|
| **性能**         | ⭐⭐⭐⭐⭐       | ⭐⭐⭐           | ⭐⭐⭐⭐         | ⭐⭐             |
| **开发复杂度**   | 高               | 中               | 中               | 低               |
| **跨平台兼容性** | 需单独编译       | 需动态库兼容     | 全平台           | 需可执行文件兼容 |
| **适用场景**     | 核心性能模块     | 快速集成现有库   | 跨浏览器/Node    | 简单命令行工具   |

---

### 六、进阶优化策略
1. **内存管理**  
   • 使用 `Napi::Buffer` 处理二进制数据  
   • 避免跨语言边界频繁传递大对象  

2. **异步扩展开发**  
   ```cpp
   // 使用 Napi::AsyncWorker 实现异步
   class AsyncAddWorker : public Napi::AsyncWorker {
   public:
     AsyncAddWorker(Napi::Function& callback, int a, int b)
       : Napi::AsyncWorker(callback), a(a), b(b) {}
     void Execute() { result = a + b; }
     void OnOK() { Callback().MakeCallback(Receiver().Value(), {Napi::Number::New(Env(), result)}); }
   private:
     int a, b, result;
   };
   ```

3. **调试技巧**  
   • 使用 `node --inspect-brk` 调试 C++ 扩展  
   • 通过 `Valgrind` 检测内存泄漏（Linux/Mac）  

---

如需进一步了解特定方案的代码细节，可参考以下资源：  
• 原生扩展开发：[Node-Addon-API 官方示例](https://github.com/nodejs/node-addon-examples)  
• FFI 高级用法：[node-ffi-napi 文档](https://www.npmjs.com/package/ffi-napi)  
• WASM 优化：[Emscripten 编译指南](https://emscripten.org/docs/compiling/index.html)