# 如何使用 docker 创建 nginx 容器
以下是使用 Docker 运行 Nginx 并开启 SSL 的详细步骤，涵盖证书配置、容器部署和自动化续签：

---

### **1. 准备工作**
#### (1) 创建本地目录结构
在宿主机上创建目录，存放 Nginx 配置和 SSL 证书：
```bash
mkdir -p ~/nginx-docker/ssl ~/nginx-docker/conf.d
```

#### (2) 准备 SSL 证书
将证书文件（`.crt` 和 `.key`）放入 `~/nginx-docker/ssl` 目录：
- `your_domain.crt`：证书文件
- `your_domain.key`：私钥文件

> **若使用 Let's Encrypt 证书**：  
> 证书路径通常为 `/etc/letsencrypt/live/your_domain/`，可直接挂载此目录。

---

### **2. 编写 Nginx 配置文件**
#### (1) 创建配置文件 `~/nginx-docker/conf.d/default.conf`
```nginx
server {
    listen 80;
    server_name your_domain.com;
    return 301 https://$host$request_uri;  # 强制跳转 HTTPS
}

server {
    listen 443 ssl http2;
    server_name your_domain.com;

    ssl_certificate     /etc/nginx/ssl/your_domain.crt;
    ssl_certificate_key /etc/nginx/ssl/your_domain.key;

    # SSL 优化配置（可选）
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 静态文件配置
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

### **3. 使用 Docker 运行 Nginx**
#### (1) 直接通过 `docker run` 启动
```bash
docker run -d \
  --name nginx-ssl \
  -p 80:80 \
  -p 443:443 \
  -v ~/nginx-docker/conf.d:/etc/nginx/conf.d \
  -v ~/nginx-docker/ssl:/etc/nginx/ssl \
  -v ~/nginx-docker/html:/usr/share/nginx/html \
  nginx:latest
```

#### (2) 参数解释
- `-p 80:80` 和 `-p 443:443`：映射 HTTP 和 HTTPS 端口。
- `-v` 挂载卷：  
  - 配置文件：`~/nginx-docker/conf.d` → `/etc/nginx/conf.d`  
  - 证书文件：`~/nginx-docker/ssl` → `/etc/nginx/ssl`  
  - 网站文件：`~/nginx-docker/html` → `/usr/share/nginx/html`

---

### **4. 验证 HTTPS 是否生效**
#### (1) 浏览器访问
打开 `https://your_domain.com`，确认地址栏显示安全锁标志。

#### (2) 命令行测试
```bash
curl -I https://your_domain.com
# 应返回 HTTP/2 200 状态码
```

---

### **5. 自动化证书管理（Let's Encrypt）**
#### (1) 使用 `certbot` Docker 镜像生成证书
```bash
docker run -it --rm \
  -v ~/nginx-docker/ssl:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone --agree-tos \
  -d your_domain.com \
  -m your_email@example.com
```

#### (2) 配置定时任务续签证书
编辑 crontab：
```bash
crontab -e
```
添加以下内容（每周续签）：
```bash
0 3 * * 1 docker run --rm \
  -v ~/nginx-docker/ssl:/etc/letsencrypt \
  certbot/certbot renew \
  --quiet && docker restart nginx-ssl
```

---

### **6. 常见问题**
#### (1) 证书权限问题
确保容器内 Nginx 可读取证书文件：
```bash
chmod 400 ~/nginx-docker/ssl/*
```

#### (2) 配置文件错误
检查容器日志：
```bash
docker logs nginx-ssl
```

#### (3) 端口冲突
停止占用 80/443 端口的其他服务：
```bash
sudo lsof -i :80  # 查找占用进程
```

---

### **总结**
- **核心步骤**：挂载证书和配置 → 启动容器 → 验证 HTTPS。  
- **自动化推荐**：使用 Let's Encrypt 的 `certbot` Docker 镜像简化证书管理。  
- **生产建议**：结合 Docker Compose 编排多容器（如 Nginx + Certbot）。