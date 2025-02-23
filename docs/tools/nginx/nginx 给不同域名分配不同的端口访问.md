# nginx 给不同域名分配不同的端口访问

以下是使用 **Nginx** 为不同域名分配不同端口的配置方法，通过反向代理实现域名到指定端口的映射：

---

### **1. 场景描述**
假设你有两个域名：
- `www.domain1.com` 需要访问本机 `3000` 端口的服务。
- `www.domain2.com` 需要访问本机 `8080` 端口的服务。

---

### **2. 配置步骤**
#### **(1) 创建域名解析**
确保域名已解析到服务器的公网 IP（如 `A 记录`指向服务器 IP）。

#### **(2) 修改 Nginx 配置文件**
编辑 Nginx 的配置文件（如 `/etc/nginx/conf.d/domain.conf`），添加以下内容：

```nginx
# 配置 domain1.com 到 3000 端口
server {
    listen 80;
    server_name www.domain1.com domain1.com;

    location / {
        proxy_pass http://localhost:3000;  # 转发到本机 3000 端口
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 配置 domain2.com 到 8080 端口
server {
    listen 80;
    server_name www.domain2.com domain2.com;

    location / {
        proxy_pass http://localhost:8080;  # 转发到本机 8080 端口
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### **(3) 检查配置并重启 Nginx**
```bash
# 检查语法是否正确
sudo nginx -t

# 重启 Nginx 服务
sudo systemctl restart nginx
```

---

### **3. 验证配置**
- 访问 `http://www.domain1.com` → 实际访问 `localhost:3000` 的服务。
- 访问 `http://www.domain2.com` → 实际访问 `localhost:8080` 的服务。

---

### **4. 高级配置（HTTPS 支持）**
若需启用 HTTPS，需为每个域名配置 SSL 证书并监听 `443` 端口：

```nginx
# domain1.com 的 HTTPS 配置
server {
    listen 443 ssl;
    server_name www.domain1.com domain1.com;

    ssl_certificate /path/to/domain1.crt;
    ssl_certificate_key /path/to/domain1.key;

    location / {
        proxy_pass http://localhost:3000;
        # ...其他代理配置同上
    }
}

# domain2.com 的 HTTPS 配置
server {
    listen 443 ssl;
    server_name www.domain2.com domain2.com;

    ssl_certificate /path/to/domain2.crt;
    ssl_certificate_key /path/to/domain2.key;

    location / {
        proxy_pass http://localhost:8080;
        # ...其他代理配置同上
    }
}

# HTTP 强制跳转 HTTPS
server {
    listen 80;
    server_name www.domain1.com domain1.com;
    return 301 https://$host$request_uri;
}

server {
    listen 80;
    server_name www.domain2.com domain2.com;
    return 301 https://$host$request_uri;
}
```

---

### **5. 常见问题**
#### **Q1：Nginx 转发后无法获取真实客户端 IP**
- **解决方案**：在代理配置中添加：
  ```nginx
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  ```

#### **Q2：端口服务未启动导致 502 错误**
- **检查服务状态**：
  ```bash
  netstat -tuln | grep ':3000\|:8080'
  ```

#### **Q3：防火墙未开放端口**
- **开放端口**（以 `firewalld` 为例）：
  ```bash
  sudo firewall-cmd --permanent --add-port=3000/tcp
  sudo firewall-cmd --permanent --add-port=8080/tcp
  sudo firewall-cmd --reload
  ```

---

### **总结**
通过 Nginx 的 `server_name` 区分不同域名，结合 `proxy_pass` 转发到不同本地端口，可轻松实现多域名多服务的统一入口管理。需确保后端服务正常运行且端口可访问。