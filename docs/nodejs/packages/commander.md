# Commander.js

Commander.js 是 Node.js 生态中用于构建命令行工具的核心库，以下为基于多篇技术文档整理的综合使用指南：

### 一、安装与初始化

1. **安装**  
   通过 npm 安装：`npm install commander`  
   引入模块：

   ```javascript
   const { program } = require("commander");
   // 或通过构造函数创建实例
   const { Command } = require("commander");
   const program = new Command();
   ```

2. **基础配置**  
   • **版本管理**：自动生成 `-V/--version` 选项
   ```javascript
   program.version("1.0.0", "-v, --version", "显示版本号");
   ```
   • **帮助信息**：默认生成 `-h/--help`，可自定义描述
   ```javascript
   program.description("文件管理工具").helpOption("-i, --info", "查看帮助");
   ```

### 二、核心功能解析

#### 1. **选项（Options）**

• **定义选项**  
 `javascript
     program.option('-d, --debug', '开启调试模式'); // 布尔类型
     program.option('-p, --port <number>', '指定端口号', 3000); // 带默认值
     `
• **参数类型与验证**  
 ◦ 强制类型转换（如 `parseInt`）  
 ◦ 枚举限制：`.choices(['dev', 'prod'])`  
 ◦ 必填选项：`.requiredOption('-c, --config <path>', '配置文件路径')`

• **特殊选项**  
 ◦ 反选项：`--no-sauce` 将 `program.sauce` 设为 `false`  
 ◦ 多词选项：`--template-engine` 转为驼峰命名 `program.templateEngine`

#### 2. **命令（Commands）**

• **子命令定义**  
 `` javascript
     program.command('create <name>')
       .description('创建项目')
       .option('-t, --type <type>', '项目类型', 'default')
       .action((name, options) => {
         console.log(`创建 ${name}，类型：${options.type}`);
       }); 
      ``
• **可变参数与多参数**  
 ◦ 固定参数：`.argument('<username>', '用户名称')`  
 ◦ 可选参数：`.argument('[password]', '密码', '默认值')`  
 ◦ 可变参数：`.argument('files...', '多个文件')`

#### 3. **动作（Action）与参数处理**

• 通过 `.action()` 绑定执行逻辑，参数按顺序接收：  
 `javascript
     .action((env, str, options) => { console.log(env, str); }); 
     `
• 参数强制转换函数（如 `parseInt`、自定义 `range` 函数）

### 三、高级特性

#### 1. **帮助信息定制**

• 添加额外说明：  
 `javascript
     program.addHelpText('after', '\n示例: $ my-cli rename file1.txt file2.txt'); 
     `

#### 2. **全局与局部选项**

• 全局选项作用于所有子命令，局部选项仅限特定命令

#### 3. **自动化功能**

• 自动生成帮助文档和版本信息，减少手动维护

### 四、实践案例

#### 文件批量重命名工具

```javascript
program
  .command("rename")
  .option("--prefix <string>", "文件名前缀")
  .action((options) => {
    files.forEach((file) => {
      fs.renameSync(file, `${options.prefix}${file}`);
    });
  });
```

执行命令：`rename --prefix=2025_`，为所有文件添加日期前缀。

### 五、调试与最佳实践

• **调试模式**：通过 `-d` 选项输出详细日志  
• **错误处理**：未定义选项或参数缺失时自动抛出错误  
• **代码结构**：建议将不同命令模块化，提升可维护性

通过以上功能组合，Commander.js 可快速构建复杂的 CLI 工具。如需完整代码示例，可参考腾讯云开发者社区的入门教程或掘金的进阶指南。
