# javascript 中的二进制数据处理

在JavaScript中处理二进制数据涉及多个对象和API，以下是详细的讲解：

### 一、核心二进制对象

1. **ArrayBuffer**
   - **作用**：表示一段固定长度的原始二进制数据缓冲区。
   - **特点**：
     - 无法直接操作，需通过视图（TypedArray或DataView）访问。
     - 创建后长度固定，不可调整。
   - **示例**：
     ```javascript
     const buffer = new ArrayBuffer(16); // 创建16字节的缓冲区
     ```

2. **TypedArray**
   - **类型**：包括`Uint8Array`、`Int16Array`、`Float32Array`等，对应不同数据类型和位数。
   - **作用**：提供对ArrayBuffer的类型化视图。
   - **示例**：
     ```javascript
     const uint8 = new Uint8Array(buffer); // 视图为8位无符号整数
     uint8[0] = 255; // 写入数据
     ```

3. **DataView**
   - **作用**：提供更灵活的方法读写不同字节序的数据。
   - **特点**：支持指定偏移量和字节序。
   - **示例**：
     ```javascript
     const view = new DataView(buffer);
     view.setInt16(0, 1234, true); // 在小端序写入16位整数
     ```

### 二、字节序处理
- **大端序（Big-Endian）**：高位字节在前（网络传输常用）。
- **小端序（Little-Endian）**：低位字节在前（x86架构常用）。
- **DataView方法**：
  ```javascript
  view.getUint32(offset, littleEndian);
  view.setFloat64(offset, value, littleEndian);
  ```

### 三、Blob与File对象
1. **Blob**
   - **作用**：表示不可变的原始数据块，常用于文件操作。
   - **示例**：
     ```javascript
     const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
     ```

2. **File**
   - **继承自Blob**，通常来自用户文件输入。
   - **示例**：
     ```javascript
     const fileInput = document.querySelector('input[type="file"]');
     const file = fileInput.files[0];
     ```

3. **转换方法**：
   - **Blob转ArrayBuffer**：
     ```javascript
     const reader = new FileReader();
     reader.onload = () => { const arrayBuffer = reader.result; };
     reader.readAsArrayBuffer(blob);
     ```
   - **ArrayBuffer转Blob**：
     ```javascript
     const blob = new Blob([arrayBuffer]);
     ```

### 四、流处理（Streams API）
- **ReadableStream**：逐块读取数据，适合处理大文件。
  ```javascript
  const stream = response.body.getReader();
  while (true) {
    const { done, value } = await stream.read();
    if (done) break;
    process(value); // value是Uint8Array
  }
  ```

### 五、实际应用场景
1. **图片处理**：
   ```javascript
   const canvas = document.querySelector('canvas');
   const ctx = canvas.getContext('2d');
   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
   const uint8Array = imageData.data; // 像素数据的Uint8ClampedArray
   ```

2. **WebSocket传输二进制**：
   ```javascript
   const socket = new WebSocket('ws://example.com');
   socket.binaryType = 'arraybuffer';
   socket.onmessage = (event) => {
     const arrayBuffer = event.data;
   };
   ```

3. **与WebAssembly交互**：
   ```javascript
   const wasmBuffer = fetch('module.wasm').then(res => res.arrayBuffer());
   WebAssembly.instantiate(wasmBuffer, imports);
   ```

### 六、数据转换与操作
1. **Base64编码/解码**：
   ```javascript
   const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
   const binaryString = atob(base64);
   const bytes = new Uint8Array([...binaryString].map(c => c.charCodeAt(0)));
   ```

2. **合并ArrayBuffer**：
   ```javascript
   function concatBuffers(buffers) {
     const total = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);
     const result = new Uint8Array(total);
     let offset = 0;
     buffers.forEach(buf => {
       result.set(new Uint8Array(buf), offset);
       offset += buf.byteLength;
     });
     return result.buffer;
   }
   ```

### 七、Node.js中的Buffer
- **Buffer**：Node.js中处理二进制的类，继承自Uint8Array。
  ```javascript
  const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
  const arrayBuffer = buf.buffer; // 转换为ArrayBuffer
  ```

### 八、注意事项与最佳实践
- **字节序敏感场景**：跨平台传输数据时，明确指定字节序。
- **内存管理**：避免频繁分配大块内存，复用缓冲区。
- **类型匹配**：确保TypedArray的类型与数据格式一致，如处理音频时用Float32Array。

通过合理使用这些API，JavaScript能够高效处理各种二进制数据需求，从简单的数据操作到复杂的流处理，均能胜任。