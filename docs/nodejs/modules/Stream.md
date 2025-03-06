# Stream 流处理模块

在 Node.js 中，`stream` 模块提供了一种高效处理流数据的方式。流（Stream）是 Node.js 处理 I/O 操作的核心机制之一，允许开发者以流的形式读取或写入大量数据，而不需要一次性加载全部数据到内存中。这对于处理大文件、实时数据传输等场景非常有用。

以下是 `stream` 模块的核心功能和示例代码：

### 1. **核心概念**

Node.js 的 Stream 是基于事件驱动的流式处理机制。主要包含以下几种类型的流：

- **Readable 流**: 数据来源，用于从文件、网络或其他数据源读取数据。
- **Writable 流**: 数据目的地，用于将数据写入文件、网络或其他目标。
- **Duplex 流**: 同时具有 Readable 和 Writable 的功能，可以双向传输数据（如 IPC 通信）。
- **Transform 流**: 在数据流动的过程中对数据进行转换。

### 2. **核心功能**

#### a. **事件驱动的流式处理**
Stream 模块通过事件通知的方式处理数据流动。主要的事件包括：

- `data`: 当有数据可读时触发。
- `end`: 流结束时触发（没有更多数据）。
- `close`: 流关闭时触发。
- `error`: 出现错误时触发。

**示例代码**:

```javascript
const fs = require('fs');
const stream = fs.createReadStream('input.txt');

stream.on('data', (chunk) => {
    console.log('接收到数据:', chunk.toString());
});

stream.on('end', () => {
    console.log('流结束');
});

stream.on('close', () => {
    console.log('流已关闭');
});

stream.on('error', (err) => {
    console.error('发生错误:', err);
});
```

#### b. **Readable 流**
`Readable` 流用于从数据源读取数据。常见的 Readable 流包括文件、网络请求等。

**示例代码**:

```javascript
const fs = require('fs');
const readline = require('readline');

const readStream = fs.createReadStream('input.txt');
const rl = readline.createInterface({
    input: readStream,
});

rl.on('line', (line) => {
    console.log(line);
});
```

#### c. **Writable 流**
`Writable` 流用于将数据写入目标。常见的 Writable 流包括文件、网络响应等。

**示例代码**:

```javascript
const fs = require('fs');
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello, Node.js!\n', 'utf8');
writeStream.write('这是第二行数据。\n', 'utf8');
writeStream.end();

writeStream.on('finish', () => {
    console.log('写入完成');
});

writeStream.on('error', (err) => {
    console.error('写入错误:', err);
});
```

#### d. **Duplex 流**
`Duplex` 流同时支持 Readable 和 Writable 功能，常用于进程间通信（IPC）。

**示例代码**:

```javascript
const stream = require('stream');

class MyDuplex extends stream.Duplex {
    constructor() {
        super();
        this.data = [];
    }

    _write(chunk, encoding, callback) {
        this.data.push(chunk.toString());
        setImmediate(() => callback(null, chunk.length));
    }

    _read(size, callback) {
        if (this.data.length === 0) {
            return callback('empty');
        }
        const chunk = this.data.shift();
        callback(null, Buffer.from(chunk));
    }
}

const duplexStream = new MyDuplex();

duplexStream.write('hello ');
duplexStream.write('world');

duplexStream.on('data', (chunk) => {
    console.log('接收到数据:', chunk.toString());
});

duplexStream.on('finish', () => {
    console.log('流结束');
});
```

#### e. **Transform 流**
`Transform` 流在数据流动的过程中对数据进行转换。常见的 Transform 流包括加密、压缩等。

**示例代码**:

```javascript
const stream = require('stream');

class MyTransform extends stream.Transform {
    _transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().toUpperCase();
        this.push(transformedChunk);
        callback(null, chunk.length);
    }
}

const transformStream = new MyTransform();

transformStream.write('hello ');
transformStream.write('world');
transformStream.end();

transformStream.on('data', (chunk) => {
    console.log('接收到数据:', chunk.toString());
});
```

### 3. **应用场景**

#### a. **文件操作**
使用 Stream 处理大文件时，可以避免一次性读取所有内容到内存中。

**示例代码**:

```javascript
const fs = require('fs');
const stream = fs.createReadStream(__dirname + '/large-file.txt');

stream.on('data', (chunk) => {
    process.stdout.write(chunk);
});

stream.on('end', () => {
    console.log('\n文件读取完成');
});
```

#### b. **网络通信**
使用 Stream 处理 HTTP 请求和响应。

**示例代码**:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const readStream = fs.createReadStream(__dirname + '/large-file.txt');

    req.pipe(readStream).pipe(res);
});

server.listen(3000, () => {
    console.log('服务器已启动，监听在 3000 端口');
});
```

### 4. **核心优势**

- **高效处理大文件**: 不需要一次性加载全部数据到内存中。
- **实时数据传输**: 支持流式读写，适合实时应用。
- **资源占用低**: 对于大数据量操作，内存占用更少。

通过以上介绍和示例代码，您可以看到 Node.js 的 Stream 模块在处理流数据时的强大功能。无论是文件操作、网络通信还是自定义流处理，Stream 都是必不可少的工具。