# serve 静态文件服务

`serve` 是一个用于快速启动静态文件服务器的命令行工具，非常适合在本地开发环境中快速搭建静态或动态 Web 应用程序。以下是关于 `serve` 的详细介绍，包括安装、基本用法、配置选项和常见问题解答。

### 安装

#### 

你可以通过 npm 或 yarn  `serve`：

```bash
npm install -g serve
```

或者

```bash
yarn global add serve
```

#### 本地安装

如果你只想在特定项目中使用 `serve`，可以将其作为开发依赖安装在本地项目中：

```bash
npm install --save-dev serve
```

### 基本用法

#### 启动静态文件服务器

假设你有一个包含 HTML 文件的项目目录，目录结构如下：

```
/my-project
  index.html
  styles.css
  script.js
```

你可以打开终端，导航到 `my-project` 目录，然后运行以下命令：

```bash
serve
```

这会启动一个本地服务器，默认监听端口 5000。你可以在浏览器中访问 `http://localhost:5000` 来查看 `index.html` 的效果。

#### 指定目录

你可以使用 `-s` 或 `--single` 参数指定要服务的目录：

```bash
serve -s my-project
```

#### 指定端口

你可以使用 `-l` 或 `--listen` 参数指定服务器监听的端口号：

```bash
serve -l 3000
```

#### 启用目录浏览

你可以使用 `-d` 或 `--directory-listing` 参数启用目录浏览功能：

```bash
serve -d
```

#### 启用 HTTPS

你可以使用 `--ssl` 参数启用 HTTPS 服务器，需要提供证书和私钥文件：

```bash
serve --ssl --cert /path/to/cert.pem --key /path/to/key.pem
```

### 配置选项

`serve` 提供了许多配置选项，可以通过命令行参数进行设置。以下是一些常见的配置示例：

- **指定端口号**：

  ```bash
  serve -l 3000
  ```

- **设置缓存时间**：

  ```bash
  serve -t 10
  ```

- **启用压缩**：

  ```bash
  serve -c
  ```

- **自动打开浏览器**：

  ```bash
  serve -o
  ```

- **自定义 404 页面**：

  默认情况下，`serve` 会返回一个自定义的 404 页面，如果你希望自定义 404 页面，可以创建一个名为 `public/index.html` 的文件，并添加你的 HTML 内容。

### 常见问题解答

#### 如何停止服务器？

在 Windows 上，你可以按 `Ctrl + C`；在 macOS 和 Linux 上，你可以按 `Cmd + C`。

#### 如何处理动态内容？

`serve` 主要用于静态文件，不支持动态内容，如果你需要处理动态内容，建议使用其他工具或框架，如 Express.js、Django 等。
