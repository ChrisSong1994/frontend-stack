# Js 中的 Bom 对象

以下是浏览器中 `window` 对象的四个核心子对象 **`location`、`navigator`、`history`、`screen`** 的详细介绍，涵盖它们的属性、方法及实际应用场景：

---

### **一、`location` 对象**
**作用**：表示当前窗口的 URL 信息，并提供操作 URL 的方法。

#### **常用属性**
| 属性                | 说明                                                                 | 示例（URL: `https://www.example.com:8080/path?q=js#section`) |
|---------------------|--------------------------------------------------------------------|-------------------------------------------------------------|
| `location.href`     | 完整的 URL 字符串（可读写，修改后会跳转页面）                        | `"https://www.example.com:8080/path?q=js#section"`          |
| `location.protocol` | 协议（`http:`、`https:`）                                           | `"https:"`                                                  |
| `location.host`     | 主机名 + 端口（如 `www.example.com:8080`）                          | `"www.example.com:8080"`                                    |
| `location.hostname` | 主机名（不带端口）                                                  | `"www.example.com"`                                          |
| `location.port`     | 端口号（默认 `80` 或 `443` 会隐藏）                                 | `"8080"`                                                    |
| `location.pathname` | URL 路径（以 `/` 开头）                                             | `"/path"`                                                   |
| `location.search`   | 查询参数（以 `?` 开头）                                             | `"?q=js"`                                                   |
| `location.hash`     | 锚点部分（以 `#` 开头）                                             | `"#section"`                                                |

#### **常用方法**
| 方法                  | 作用                                                                 | 示例                              |
|-----------------------|--------------------------------------------------------------------|-----------------------------------|
| `location.assign(url)`   | 加载新页面（会在历史记录中新增条目）                                  | `location.assign("https://new.com")` |
| `location.replace(url)`  | 替换当前页面（不会新增历史记录，无法后退）                            | `location.replace("https://new.com")` |
| `location.reload()`      | 重新加载当前页面（参数 `true` 表示强制从服务器加载）                   | `location.reload(true)`              |

#### **实际应用**
```javascript
// 获取当前查询参数
const params = new URLSearchParams(location.search);
console.log(params.get("q")); // "js"

// 跳转页面（保留历史记录）
location.href = "https://new-page.com";
// 或等效写法：location.assign("https://new-page.com");
```

---

### **二、`navigator` 对象**
**作用**：提供浏览器和操作系统的信息，支持部分硬件和网络功能。

#### **常用属性**
| 属性                     | 说明                                                                 |
|--------------------------|--------------------------------------------------------------------|
| `navigator.userAgent`    | 浏览器用户代理字符串（可用于识别浏览器类型，但可被篡改）              |
| `navigator.platform`     | 操作系统平台（如 `"Win32"`、`"MacIntel"`）                           |
| `navigator.language`     | 浏览器首选语言（如 `"zh-CN"`）                                       |
| `navigator.cookieEnabled` | 是否启用 Cookie（布尔值）                                            |
| `navigator.onLine`       | 是否联网（布尔值）                                                   |

#### **常用方法**
| 方法                          | 作用                                                                 |
|-------------------------------|--------------------------------------------------------------------|
| `navigator.geolocation`        | 获取用户地理位置（需用户授权）                                       |
| `navigator.clipboard`          | 访问剪贴板（现代浏览器支持）                                         |
| `navigator.mediaDevices`       | 访问摄像头和麦克风（需用户授权）                                     |
| `navigator.serviceWorker`      | 注册 Service Worker（用于 PWA 离线缓存）                             |

#### **实际应用**
```javascript
// 检测用户浏览器类型
if (navigator.userAgent.includes("Chrome")) {
  console.log("当前使用 Chrome 浏览器");
}

// 获取地理位置
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords.latitude, pos.coords.longitude),
  (err) => console.error("获取位置失败：", err)
);
```

---

### **三、`history` 对象**
**作用**：管理浏览器的会话历史记录（前进、后退、修改 URL）。

#### **常用属性**
| 属性               | 说明                         |
|--------------------|----------------------------|
| `history.length`   | 当前窗口历史记录的总条目数     |

#### **常用方法**
| 方法                           | 作用                                                                 |
|--------------------------------|--------------------------------------------------------------------|
| `history.back()`               | 后退到上一个页面（等效用户点击后退按钮）                             |
| `history.forward()`            | 前进到下一个页面（等效用户点击前进按钮）                             |
| `history.go(n)`                | 跳转到历史记录中相对当前页的第 `n` 个页面（`n` 可正可负）             |
| `history.pushState(state, title, url)` | 添加一条历史记录（不刷新页面）                                        |
| `history.replaceState(state, title, url)` | 替换当前历史记录（不刷新页面）                                       |

#### **实际应用**
```javascript
// 单页应用（SPA）路由控制
history.pushState({ page: "home" }, "", "/home"); // 修改 URL 为 /home，不刷新页面

// 监听历史记录变化
window.addEventListener("popstate", (event) => {
  console.log("URL 变化：", location.pathname);
  console.log("附加状态：", event.state); // pushState/replaceState 的 state 数据
});
```

---

### **四、`screen` 对象**
**作用**：提供用户屏幕的物理信息（分辨率、颜色深度等）。

#### **常用属性**
| 属性                 | 说明                                                                 |
|----------------------|--------------------------------------------------------------------|
| `screen.width`       | 屏幕的总宽度（像素）                                                 |
| `screen.height`      | 屏幕的总高度（像素）                                                 |
| `screen.availWidth`  | 可用宽度（屏幕宽度减去任务栏等界面元素）                              |
| `screen.availHeight` | 可用高度（同上）                                                     |
| `screen.colorDepth`  | 颜色深度（如 `24` 位）                                               |
| `screen.pixelDepth`  | 像素深度（通常与 `colorDepth` 相同）                                 |

#### **实际应用**
```javascript
// 检测屏幕分辨率
if (screen.width < 1024) {
  console.log("小屏幕设备，启用移动布局");
}

// 全屏显示元素
document.documentElement.requestFullscreen();
```

---

### **五、总结**
| **对象**     | **核心用途**                                                                 | **典型场景**                     |
|-------------|----------------------------------------------------------------------------|---------------------------------|
| `location`  | 操作 URL 和页面导航                                                         | 页面跳转、参数解析、锚点定位       |
| `navigator` | 获取浏览器/设备信息，访问硬件功能                                            | 浏览器检测、地理位置、剪贴板操作   |
| `history`   | 管理历史记录（SPA 路由控制）                                                 | 单页应用路由、无刷新 URL 修改      |
| `screen`    | 获取屏幕物理属性                                                             | 响应式布局、全屏控制               |

**注意事项**：
1. `navigator` 的某些属性（如 `userAgent`）可能被用户篡改，不可完全依赖。
2. 修改 `location.href` 或调用 `pushState` 可能触发页面跳转或重新渲染。
3. `history` 的 `state` 对象有大小限制（通常约 640KB）。