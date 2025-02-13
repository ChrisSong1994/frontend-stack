# nginx 如何设置 base path

在Nginx中设置基础路径（base path）通常涉及到配置`location`块，以及根据你的应用需求可能还需要调整反向代理的设置。下面我将详细解释如何进行这些配置。

### 对于Vue.js项目

如果你正在使用Vue.js，并且希望部署一个带有history模式的单页应用（SPA），你可能会需要为你的应用指定一个基路径。这可以通过在Vue Router中设置`base`选项来完成：

```javascript
const router = createRouter({
  history: createWebHistory('/web/'), // 设置基路径
  routes: [...]
})
```

然后，在Nginx配置文件中，你需要相应地设置`location`块，以便正确处理请求：

```nginx
location /web {
    alias /home/foo/workspace/xpos/web/;
    try_files $uri $uri/ /web/index.html;
}
```

这里，`alias`指令指定了静态资源的实际位置，而`try_files`指令确保当找不到匹配的文件时，默认提供`index.html`文件，这对于SPA来说是必要的，因为它允许前端路由处理URL解析。

### 对于其他类型的应用

对于非Vue.js的应用，或者如果你只是想重写某些请求路径，你可以使用`rewrite`指令。例如，如果你想把所有对`/old-path/`下的请求重定向到`/new-path/`下，可以这样配置：

```nginx
location /old-path/ {
    rewrite ^/old-path/(.*)$ /new-path/$1 break;
    # 这里可以添加proxy_pass或其他指令
}
```

这里的正则表达式`^/old-path/(.*)$`捕获了原始请求路径中的剩余部分，并将其重写到新的路径`/new-path/$1`上。`break`标志表示一旦规则匹配成功，就不再尝试其他规则。

### 配置多级路径

如果您的应用需要支持多级路径，您可以像这样设置：

```javascript
const vueRouter = new Router({
  mode: "history",
  base: "/app/web", // 多级路径
  routes: [...]
})
```

相应的Nginx配置可能是这样的：

```nginx
location /app/web {
    alias /var/www/html/app/web/;
    try_files $uri $uri/ /app/web/index.html;
}
```

这使得您的应用能够正确地响应位于`/app/web`这个上下文中的请求。

### 注意事项

- 当使用`alias`时，请确保它后面跟着斜杠（/），除非你要指向的是具体文件。
- 如果您使用的是`root`而不是`alias`，那么Nginx会将请求的URI附加到`root`定义的目录之后，因此不需要手动添加斜杠。
- 在生产环境中，确保所有的静态资源引用都基于正确的`base`路径，否则可能会导致404错误或加载失败的问题。

综上所述，Nginx中设置base path主要是通过合理配置`location`和使用适当的指令如`alias`、`root`、`try_files`等来实现的。具体的配置方式取决于你的应用架构和需求。