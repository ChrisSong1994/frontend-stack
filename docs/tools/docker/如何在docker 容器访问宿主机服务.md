# 如何在docker 容器访问宿主机服务

在 Docker 容器中访问宿主机的服务，可以通过多种方式实现，具体取决于你的操作系统以及你希望使用的网络配置。以下是几种常见的方法：

### 使用 Host 模式

当你启动容器时，可以使用 `--network host` 参数来让容器与宿主机共享网络命名空间。这意味着容器可以直接使用 `localhost` 或者 `127.0.0.1` 来访问宿主机上的服务 。

```bash
docker run --network host my_container_image
```

需要注意的是，在这种模式下，容器的端口映射将不起作用，因为所有端口都是直接暴露在宿主机上。

### 使用 Bridge 模式和宿主机 IP 地址

默认情况下，Docker 使用 bridge 网络模式，并为每个容器分配一个独立的 IP 地址。在这种情况下，你可以通过查询宿主机的 IP 地址（通常是 Docker 网桥 `docker0` 的 IP 地址）来从容器内部访问宿主机的服务 。

在 Linux 上，你可以通过以下命令获取宿主机的 IP 地址：

```bash
ip addr show docker0
```

然后，你可以用这个 IP 地址加上相应的端口号来访问宿主机的服务。

### 使用特殊的 DNS 名称（仅限 Docker Desktop for Mac/Windows）

如果你正在使用 Docker Desktop for Mac 或 Windows，可以利用特殊的 DNS 名称 `host.docker.internal` 来解析宿主机的 IP 地址 。

```bash
curl http://host.docker.internal:8080
```

这允许你在容器内轻松地指向宿主机上的服务。

### 使用 `--add-host` 标志

对于 Linux 用户，如果你想在容器中使用类似于 `host.docker.internal` 的功能，可以在启动容器时使用 `--add-host` 标志来手动添加一个条目到容器的 `/etc/hosts` 文件中 。

```bash
docker run -d --add-host host.docker.internal:host-gateway my_container_image
```

这样就可以在容器内通过 `host.docker.internal` 访问宿主机了。

### 总结

- **Host 模式**：适用于需要容器与宿主机共享网络的情况，但要注意端口冲突的问题。
- **Bridge 模式 + 宿主机 IP**：适合大多数情况，特别是当容器需要有自己独立的网络环境时。
- **`host.docker.internal`**：方便快捷的方式，特别适合 Docker Desktop 用户。
- **`--add-host` 标志**：为 Linux 提供了一个类似的解决方案，允许自定义主机名到宿主机 IP 的映射。

选择哪种方式取决于你的具体需求和环境设置。每种方法都有其适用场景，理解它们的区别有助于更好地设计容器网络策略。