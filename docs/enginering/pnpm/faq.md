# FAQ

## 1、pnpm add -g xxx 提示我运行 pnpm setup，运行 setup 之后还是不行

![](./images/pnpm_global_q.png)

**解决方式：**
```bash
# 查看 pnpm store 目录
pnpm store path

添加 `global` 目录

pnpm config set store-dir /Users/xxx/.pnpm/store

```