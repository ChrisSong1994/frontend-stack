# SSE（Server-Sent Events）协议

### **SSE 协议核心概念**
SSE 是一种基于 HTTP 的 **服务器到客户端的单向实时通信协议**，适用于需要服务器主动推送数据的场景（如实时通知、股票行情）。与 WebSocket 不同，SSE 是纯文本协议，无需双向通信。

#### **关键特性**：
1. **单向通信**：仅服务器 → 客户端。
2. **轻量级**：基于 HTTP，无需复杂握手。
3. **自动重连**：客户端内置重连机制。
4. **事件与数据分离**：支持自定义事件类型。

#### **消息格式**：
```text
event: messageType\n
data: {"key": "value"}\n
id: 123\n
retry: 5000\n\n
```
- `event`: 事件类型（如 `message`, `update`）。
- `data`: 有效负载（必须为字符串，常用 JSON）。
- `id`: 消息 ID（用于断线重连定位）。
- `retry`: 重连时间（毫秒）。

---

### **Node.js 实现 SSE 服务器**

#### **1. 基础代码**
```javascript
const http = require('http');
const { EventEmitter } = require('events');

// 创建事件发射器（模拟实时数据源）
const eventEmitter = new EventEmitter();

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 仅处理 SSE 路径
  if (req.url === '/sse') {
    // 设置 SSE 响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*' // 允许跨域
    });

    // 发送初始消息
    res.write('event: connected\ndata: Welcome!\n\n');

    // 定义发送数据的函数
    const sendEvent = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // 监听事件并推送（示例：每秒发送时间戳）
    const timer = setInterval(() => {
      sendEvent('time', { timestamp: Date.now() });
    }, 1000);

    // 客户端断开连接时清理资源
    req.on('close', () => {
      clearInterval(timer);
      eventEmitter.removeAllListeners('customEvent');
      res.end();
    });

    // 监听自定义事件（外部触发）
    eventEmitter.on('customEvent', (data) => {
      sendEvent('custom', data);
    });

  } else {
    res.writeHead(404);
    res.end();
  }
});

// 启动服务器
server.listen(3000, () => {
  console.log('SSE server running at http://localhost:3000');
});

// 模拟外部事件触发（测试用）
setTimeout(() => {
  eventEmitter.emit('customEvent', { message: 'Triggered from server!' });
}, 5000);
```

#### **2. 客户端 HTML 示例**
```html
<!DOCTYPE html>
<html>
<body>
  <div id="messages"></div>

  <script>
    const eventSource = new EventSource('http://localhost:3000/sse');

    // 监听默认事件（无 event 字段的消息）
    eventSource.onmessage = (e) => {
      console.log('Message:', e.data);
    };

    // 监听特定事件类型
    eventSource.addEventListener('time', (e) => {
      const data = JSON.parse(e.data);
      document.getElementById('messages').innerHTML += 
        `Time: ${new Date(data.timestamp).toLocaleTimeString()}<br>`;
    });

    eventSource.addEventListener('custom', (e) => {
      document.getElementById('messages').innerHTML += 
        `Custom Event: ${e.data}<br>`;
    });

    // 错误处理
    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      eventSource.close();
    };
  </script>
</body>
</html>
```

---

### **关键点解析**
1. **协议头设置**：
   - `Content-Type: text/event-stream` 标识 SSE 流。
   - `Cache-Control: no-cache` 禁用缓存。
   - `Connection: keep-alive` 保持长连接。

2. **消息构建**：
   - 每条消息以 `\n\n` 结束。
   - 使用 `event` 字段区分事件类型，客户端通过 `addEventListener` 订阅。

3. **客户端重连**：
   - 当连接意外中断时，浏览器自动尝试重连（基于 `retry` 值）。
   - `id` 字段帮助服务器定位最后接收的消息。

4. **资源释放**：
   - 监听 `req.close` 事件清理定时器和事件监听，避免内存泄漏。

---

### **测试与验证**
1. 启动 Node.js 服务器：`node sse-server.js`
2. 打开客户端 HTML 文件，观察控制台和页面更新：
   - 每秒收到时间戳事件。
   - 5 秒后收到自定义事件。
3. 断开网络或关闭服务器，观察客户端自动重连行为。

---

### **适用场景**
- 实时通知（如邮件提醒、系统报警）
- 数据监控仪表盘
- 新闻/社交媒体信息流

---

### **进阶优化**
1. **身份验证**：
   ```javascript
   // 服务器端检查 Token
   if (req.headers.authorization !== 'Bearer YOUR_TOKEN') {
     res.writeHead(401);
     res.end();
   }
   ```

2. **历史消息恢复**：
   ```javascript
   let lastEventId = 0;
   // 客户端首次连接时发送 Last-Event-ID 头
   if (req.headers['last-event-id']) {
     lastEventId = parseInt(req.headers['last-event-id']);
   }
   // 发送时附带 id 字段
   res.write(`id: ${lastEventId++}\n`);
   ```

3. **性能优化**：
   - 使用 HTTP/2 多路复用。
   - 压缩文本数据（需客户端支持）。

---

通过以上实现，你可以快速搭建一个高效、可靠的 SSE 服务，满足实时数据推送需求。