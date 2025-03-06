# File system

Node.js 的 `fs`（File System）模块为开发者提供了强大的接口，用于与操作系统文件系统进行交互。以下是该模块的核心能力详细介绍：

#### 1. 文件读写操作
Node.js 提供了多种方法来处理文件的读取和写入操作。

**同步与异步操作：**
- **同步读取**：使用 `fs.readFileSync` 或 `fs.readFileSync`。
  ```javascript
  const fs = require('fs');
  const fileContent = fs.readFileSync('example.txt', 'utf8');
  console.log(fileContent);
  ```
- **异步读取**：使用 `fs.readFile`，通过回调函数处理结果。
  ```javascript
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```

**写入文件：**
- **同步写入**：
  ```javascript
  fs.writeFileSync('example.txt', 'Hello, World!');
  ```
- **异步写入**：
  ```javascript
  fs.writeFile('example.txt', 'New content', (err) => {
    if (err) throw err;
    console.log('File written successfully');
  });
  ```

#### 2. 文件和目录管理

**创建、删除和遍历目录：**
- **创建目录**：使用 `fs.mkdirSync` 或 `fs.mkdir`。
  ```javascript
  fs.mkdirSync('newDir', { recursive: true }); // 递归创建所有必要的父目录
  ```
- **删除目录**：使用 `fs.rmdirSync` 或 `fs.rmdir`。
  ```javascript
  fs.rmdirSync('emptyDir'); // 删除空目录
  ```
- **列出目录内容**：使用 `fs.readdirSync` 或 `fs.readdir`。
  ```javascript
  fs.readdirSync('.').forEach(file => {
    console.log(file);
  });
  ```

#### 3. 文件元数据获取

通过 `fs.stat` 方法，可以获取文件或目录的详细信息。

- **同步获取统计信息**：
  ```javascript
  const stats = fs.statSync('example.txt');
  console.log(`File size: ${stats.size} bytes`);
  console.log(`Created at: ${stats.birthtime}`);
  ```
- **异步获取统计信息**：
  ```javascript
  fs.stat('example.txt', (err, stats) => {
    if (err) throw err;
    console.log(`Modified time: ${stats.mtime}`);
  });
  ```

#### 4. 异步与流式操作

Node.js 的非阻塞I/O模型使得异步文件操作高效且不阻塞主线程。

- **读取流（ReadStream）**：
  ```javascript
  const readStream = fs.createReadStream('largeFile.txt');
  readStream.on('data', (chunk) => {
    console.log(`Chunk received: ${chunk.length} bytes`);
  });
  readStream.on('end', () => {
    console.log('End of file reached');
  });
  ```
- **写入流（WriteStream）**：
  ```javascript
  const writeStream = fs.createWriteStream('output.txt');
  writeStream.write('Hello, World!');
  writeStream.end();
  ```

#### 5. 权限管理

Node.js 提供了方法来管理文件和目录的权限。

- **更改文件权限**：
  ```javascript
  fs.chmodSync('file.txt', '0o777'); // 设置为所有人可读、写、执行
  ```
- **更改所有者和组**：
  ```javascript
  fs.chownSync('file.txt', userId, groupId); // 更改文件的所有者和组
  ```

#### 6. 符号链接操作

符号链接允许创建指向其他文件或目录的快捷方式。

- **创建符号链接**：
  ```javascript
  fs.symlinkSync('targetFile.txt', 'linkToFile.txt'); // 创建硬链接（在类 Unix 系统上）
  ```
- **读取符号链接的目标**：
  ```javascript
  const target = fs.readlinkSync('linkToFile.txt');
  console.log(target); // 输出 'targetFile.txt'
  ```

#### 7. 路径处理

虽然不属于 `fs` 模块本身，但 `path` 模块与文件操作密切相关。

- **解析路径**：
  ```javascript
  const path = require('path');
  const resolvedPath = path.resolve(__dirname, 'subdir', 'file.txt'); // 返回绝对路径
  console.log(resolvedPath);
  ```
- **标准化路径**：
  ```javascript
  const normalizedPath = path.normalize('/user/home/../file.txt'); // 返回 '/user/home/file.txt'
  ```

#### 总结

Node.js 的 `fs` 模块通过提供丰富的接口，使开发者能够高效地进行文件和目录操作。掌握其核心能力——文件读写、目录管理、元数据获取、异步与流式操作、权限管理以及符号链接操作，将有助于开发高效的文件管理系统。结合适当的错误处理和路径解析，可以进一步提升应用的稳定性和可靠性。