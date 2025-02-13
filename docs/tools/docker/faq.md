# 常见问题

## 1、docker build 出现 failed to resolve source metadata for ...
> https://forums.docker.com/t/cant-reach-registry-1-docker-io/135016
- 检查是否断网
- 使用 `--no-cache`  参数重新构建
- 尝试使用其他的镜像源 使用 `--registry-mirror` 参数