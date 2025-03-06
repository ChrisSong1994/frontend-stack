# HTTP 模块 

以下是 Node.js 中 **HTTP 模块**的详细介绍，涵盖其核心功能、关键 API 及示例代码。该模块是构建 Web 服务器和客户端的基础，支持 HTTP/1.1 协议，并能灵活处理请求和响应。

### **1. 核心功能概览**
| **功能**              | **说明**                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| **创建 HTTP 服务器**   | 监听端口，处理客户端请求（如浏览器、API 调用）。                        |
| **处理请求与响应**     | 解析请求头、请求体，构造响应头和响应体。                                |
| **路由管理**           | 根据 URL 路径和 HTTP 方法（GET/POST 等）分发处理逻辑。                  |
| **流式处理**           | 支持数据流式传输（如大文件上传/下载）。                                 |
| **HTTP 客户端**        | 发起 HTTP 请求到其他服务器（类似 `fetch` 或 `axios` 的功能）。           |

### **2. 创建 HTTP 服务器**
#### **基础示例：返回 "Hello World"**
```javascript
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // 发送响应体
  res.end('Hello World\n');
});

// 监听 3000 端口
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### **3. 请求对象（`IncomingMessage`）**
当客户端发起请求时，回调函数的第一个参数是 `req`（请求对象），包含以下关键属性和方法：

#### **关键属性**
| 属性               | 说明                                      |
|--------------------|------------------------------------------|
| `req.method`       | HTTP 方法（如 `GET`, `POST`）。          |
| `req.url`          | 请求的 URL 路径（如 `/api/data?name=foo`）。 |
| `req.headers`      | 请求头信息（对象形式）。                  |

#### **获取请求体数据**
```javascript
// 处理 POST 请求的请求体
let body = [];
req.on('data', (chunk) => {
  body.push(chunk);
}).on('end', () => {
  body = Buffer.concat(body).toString();
  console.log('Request Body:', body);
});
```

### **4. 响应对象（`ServerResponse`）**
第二个参数是 `res`（响应对象），用于构造返回给客户端的响应：

#### **关键方法**
| 方法                          | 说明                                                                 |
|------------------------------|---------------------------------------------------------------------|
| `res.writeHead(statusCode, headers)` | 设置响应状态码和头信息（如 `200`、`404`）。                         |
| `res.write(data)`             | 发送响应体数据（可多次调用）。                                      |
| `res.end([data])`             | 结束响应，可选发送最后一次数据。                                    |
| `res.setHeader(name, value)`  | 单独设置响应头。                                                    |

#### **示例：返回 JSON 数据**
```javascript
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'Success', data: [1, 2, 3] }));
```

### **5. 路由与请求分发**
根据 `req.url` 和 `req.method` 实现路由逻辑：
```javascript
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // 处理 GET 请求
  if (method === 'GET' && url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alice' }]));
  } 
  // 处理 POST 请求
  else if (method === 'POST' && url === '/api/users') {
    let body = [];
    req.on('data', chunk => body.push(chunk))
       .on('end', () => {
         body = JSON.parse(Buffer.concat(body).toString());
         console.log('Received data:', body);
         res.writeHead(201);
         res.end('User created');
       });
  } 
  // 处理未匹配的路由
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
```

### **6. 流式处理**
#### **示例：文件下载（流式返回大文件）**
```javascript
const fs = require('fs');

http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./large-file.zip');
  
  // 设置响应头
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="large-file.zip"'
  });
  
  // 管道操作：将文件流直接传输到响应流
  fileStream.pipe(res);
}).listen(3000);
```

### **7. 错误处理**
#### **服务器错误监听**
```javascript
server.on('error', (err) => {
  console.error('Server error:', err);
});

// 请求超时设置（单位：毫秒）
server.timeout = 5000; // 5秒无活动则关闭连接
```

#### **客户端请求错误处理**
```javascript
req.on('error', (err) => {
  console.error('Request error:', err);
  res.statusCode = 400;
  res.end('Bad Request');
});
```

### **8. HTTP 客户端**
#### **发起 GET 请求**
```javascript
http.get('http://jsonplaceholder.typicode.com/posts/1', (response) => {
  let data = '';
  response.on('data', chunk => data += chunk);
  response.on('end', () => {
    console.log('Response:', JSON.parse(data));
  });
}).on('error', (err) => {
  console.error('Request failed:', err);
});
```

#### **发起 POST 请求**
```javascript
const postData = JSON.stringify({ title: 'foo', body: 'bar' });

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  port: 80,
  path: '/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = http.request(options, (res) => {
  res.on('data', (chunk) => {
    console.log('Response:', chunk.toString());
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err);
});

req.write(postData);
req.end();
```

### **9. 性能优化与生产建议**
1. **反向代理**：生产环境中建议使用 Nginx 或 Caddy 作为反向代理，处理静态文件、SSL 和负载均衡。
2. **集群模式**：结合 `cluster` 模块充分利用多核 CPU。
3. **框架选择**：复杂项目推荐使用 Express、Koa 或 Fastify，简化路由和中间件管理。
4. **连接管理**：合理设置 `keep-alive` 和超时时间，优化资源利用率。

### **总结**
Node.js 的 HTTP 模块提供了底层的网络通信能力，适合学习 HTTP 协议原理或构建轻量级服务。对于复杂场景，结合框架和生态工具（如 `body-parser`、`multer`）可大幅提升开发效率。通过灵活使用流式处理和事件机制，能够高效处理高并发请求。