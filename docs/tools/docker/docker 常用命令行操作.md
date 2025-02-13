以下是 Docker 的常用命令行操作总结，涵盖镜像管理、容器操作、网络配置、数据卷等核心场景：

---

### **1. 镜像管理**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker images` | 列出本地镜像 | `docker images` |
| `docker pull` | 拉取镜像 | `docker pull nginx:latest` |
| `docker build` | 构建镜像 | `docker build -t myapp:v1 .` |
| `docker rmi` | 删除镜像 | `docker rmi myapp:v1` |
| `docker tag` | 标记镜像 | `docker tag myapp:v1 myapp:latest` |
| `docker save` | 导出镜像为文件 | `docker save -o myapp.tar myapp:v1` |
| `docker load` | 从文件导入镜像 | `docker load -i myapp.tar` |

---

### **2. 容器操作**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker run` | 创建并运行容器 | `docker run -d -p 80:80 --name nginx nginx` |
| `docker start` | 启动已停止的容器 | `docker start nginx` |
| `docker stop` | 停止运行中的容器 | `docker stop nginx` |
| `docker restart` | 重启容器 | `docker restart nginx` |
| `docker rm` | 删除容器 | `docker rm nginx` |
| `docker ps` | 查看容器列表 | `docker ps -a`（含已停止的容器） |
| `docker exec` | 在运行中的容器内执行命令 | `docker exec -it nginx bash` |
| `docker logs` | 查看容器日志 | `docker logs -f nginx` |
| `docker inspect` | 查看容器详细信息 | `docker inspect nginx` |

#### **常用 `docker run` 参数**：
- `-d`：后台运行（detach）。
- `-p <主机端口>:<容器端口>`：端口映射。
- `-v <主机路径>:<容器路径>`：挂载数据卷。
- `--name`：指定容器名称。
- `--restart=always`：容器退出时自动重启。
- `-e`：设置环境变量（如 `-e MYSQL_ROOT_PASSWORD=123456`）。

---

### **3. 数据卷管理**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker volume create` | 创建数据卷 | `docker volume create myvol` |
| `docker volume ls` | 列出数据卷 | `docker volume ls` |
| `docker volume inspect` | 查看数据卷详情 | `docker volume inspect myvol` |
| `docker volume rm` | 删除数据卷 | `docker volume rm myvol` |
| **挂载数据卷** | | `docker run -v myvol:/app/data nginx` |

---

### **4. 网络管理**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker network ls` | 查看网络列表 | `docker network ls` |
| `docker network create` | 创建自定义网络 | `docker network create mynet` |
| `docker network inspect` | 查看网络详情 | `docker network inspect mynet` |
| `docker network connect` | 将容器连接到网络 | `docker network connect mynet nginx` |
| `docker network disconnect` | 断开容器与网络的连接 | `docker network disconnect mynet nginx` |

---

### **5. 日志与监控**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker logs` | 查看容器日志 | `docker logs -f --tail 100 nginx` |
| `docker stats` | 实时监控容器资源使用 | `docker stats` |
| `docker top` | 查看容器内进程 | `docker top nginx` |

---

### **6. 清理与维护**
| 命令 | 说明 | 示例 |
|------|------|------|
| `docker system prune` | 清理无用镜像、容器、网络等 | `docker system prune -a`（谨慎使用） |
| `docker container prune` | 清理已停止的容器 | `docker container prune` |
| `docker image prune` | 清理无标签的镜像 | `docker image prune` |

---

### **7. 组合命令示例**
1. **一键停止并删除所有容器**：
   ```bash
   docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
   ```

2. **删除所有未使用的镜像**：
   ```bash
   docker image prune -a
   ```

3. **进入容器终端**：
   ```bash
   docker exec -it nginx sh
   ```

4. **复制文件到容器**：
   ```bash
   docker cp local.txt nginx:/app/
   ```

---

### **8. Docker Compose 常用命令**
| 命令 | 说明 |
|------|------|
| `docker-compose up` | 启动服务 | 
| `docker-compose down` | 停止并删除服务 |
| `docker-compose logs` | 查看服务日志 |
| `docker-compose build` | 重新构建镜像 |

---

### **注意事项**
1. **谨慎删除**：`docker system prune` 会删除所有未使用的资源（镜像、容器、网络等）。
2. **数据持久化**：重要数据应通过 `-v` 挂载或使用数据卷。
3. **权限问题**：在容器内操作文件时注意用户权限（如 `root` 用户与普通用户）。

掌握这些命令后，可以高效管理 Docker 容器化应用的开发、部署和维护。