# clashx 如何设置终端代理

ClashX 是一款开源的跨平台代理工具，它支持多种代理模式，包括 HTTP 代理、SOCKS5 代理、Shadowsocks 代理等。
修改 ~/.zshrc 文件，添加如下内容：

```bash
export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"
export http_proxy="http://127.0.0.1:7890"
export https_proxy=$http_proxy
```
保存并执行 `source ~/.zshrc` 命令，重启终端。

验证：
```bash
 curl cip.cc
```


