# websocket 协议简介

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，允许客户端和服务器之间实时双向数据传输。相比传统的 HTTP 轮询，WebSocket 显著降低了延迟和带宽消耗，适合实时聊天、在线游戏、实时数据监控等场景。

---

### **一、WebSocket 协议核心特性**
1. **全双工通信**：客户端和服务器可同时发送数据。
2. **低延迟**：建立连接后无需重复握手，数据实时传输。
3. **轻量级协议**：数据帧头部开销小（最小仅 2 字节）。
4. **支持跨域**：通过 `Origin` 头实现安全策略。
5. **协议标识**：使用 `ws`（非加密）或 `wss`（加密）协议。

---

### **二、WebSocket 握手过程**
WebSocket 通过 HTTP 协议完成初始握手，之后升级为 WebSocket 协议：
1. **客户端请求**：
   ```http
   GET /chat HTTP/1.1
   Host: example.com
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   Sec-WebSocket-Version: 13
   ```
2. **服务端响应**：
   ```http
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   ```

---

### **三、前端使用 WebSocket**
浏览器通过 `WebSocket API` 实现客户端功能。

#### **1. 基本用法**
```javascript
// 创建 WebSocket 连接（使用 wss 加密协议）
const socket = new WebSocket('wss://example.com/chat');

// 监听连接打开事件
socket.onopen = () => {
  console.log('WebSocket 连接已建立');
  socket.send('Hello Server!');
};

// 监听消息事件
socket.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

// 监听错误事件
socket.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

// 监听连接关闭事件
socket.onclose = (event) => {
  console.log('连接已关闭', event.code, event.reason);
};
```

#### **2. 发送数据**
```javascript
// 发送文本
socket.send('Hello World');

// 发送 JSON
const data = { type: 'message', content: 'Hi' };
socket.send(JSON.stringify(data));

// 发送二进制数据（如 ArrayBuffer）
const buffer = new ArrayBuffer(8);
socket.send(buffer);
```

#### **3. 关闭连接**
```javascript
// 客户端主动关闭连接
socket.close(1000, '正常关闭');

// 关闭码示例：
// 1000 - 正常关闭
// 1001 - 服务器终止连接
// 1002 - 协议错误
```

---

### **四、Node.js 服务端实现**
Node.js 可通过 `ws` 或 `socket.io` 库实现 WebSocket 服务。

#### **1. 使用基础库 `ws`**
```bash
npm install ws
```

**服务端代码**：
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 接收客户端消息
  ws.on('message', (message) => {
    console.log('收到消息:', message.toString());

    // 广播消息给所有客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // 发送欢迎消息
  ws.send('欢迎加入聊天室！');

  // 监听连接关闭
  ws.on('close', () => {
    console.log('客户端已断开');
  });
});
```

#### **2. 使用 `socket.io`（支持降级兼容）**
```bash
npm install socket.io
```

**服务端代码**：
```javascript
const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
  cors: { origin: '*' } // 允许跨域
});

io.on('connection', (socket) => {
  console.log('客户端已连接');

  // 接收客户端消息
  socket.on('message', (data) => {
    console.log('收到消息:', data);
    // 广播消息给所有客户端
    io.emit('message', data);
  });

  // 监听断开事件
  socket.on('disconnect', () => {
    console.log('客户端已断开');
  });
});

server.listen(3000, () => {
  console.log('WebSocket 服务运行在 http://localhost:3000');
});
```

**前端适配 `socket.io`**：
```html
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:3000');

  socket.on('connect', () => {
    console.log('已连接到服务器');
    socket.send('Hello Server!');
  });

  socket.on('message', (data) => {
    console.log('收到消息:', data);
  });
</script>
```

---

### **五、WebSocket 数据格式**
1. **文本**：UTF-8 编码字符串。
2. **二进制**：`Blob` 或 `ArrayBuffer`（如图片、文件）。
3. **协议设计建议**：
   - 使用 JSON 格式传递结构化数据。
   - 定义消息类型字段（如 `{ type: 'chat', content: 'Hi' }`）。

---

### **六、常见问题处理**
#### **1. 跨域问题**
- 服务端设置响应头：
  ```javascript
  const wss = new WebSocket.Server({
    server,
    path: '/chat',
    verifyClient: (info, done) => {
      done(info.origin === 'https://your-domain.com'); // 校验来源
    }
  });
  ```

#### **2. 心跳检测**
防止连接因超时被关闭：
```javascript
// 服务端定时发送心跳
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(); // 发送心跳包
  });
}, 30000);

// 客户端响应 pong
ws.on('pong', () => {
  ws.isAlive = true;
});
```

#### **3. 断线重连**
前端实现自动重连：
```javascript
function connect() {
  const socket = new WebSocket('wss://example.com/chat');

  socket.onclose = () => {
    console.log('连接断开，5秒后重连...');
    setTimeout(connect, 5000);
  };
}
connect();
```

---

### **七、适用场景**
1. **实时聊天**：消息即时收发。
2. **在线协作**：多人文档编辑、白板。
3. **实时监控**：股票行情、物联网设备数据。
4. **游戏**：多玩家状态同步。

---

### **八、对比其他技术**
| 技术 | 特点 | 适用场景 |
|------|------|----------|
| **WebSocket** | 全双工、低延迟 | 实时双向通信（如聊天、游戏） |
| **SSE（Server-Sent Events）** | 单向（服务器到客户端） | 实时数据推送（如新闻、日志） |
| **长轮询（Long Polling）** | 基于 HTTP，高延迟 | 兼容性要求高的简单实时场景 |

掌握 WebSocket 的使用后，可以轻松构建高性能实时应用。