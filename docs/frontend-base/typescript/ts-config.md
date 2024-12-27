# tsConfig.json 配置

tsconfig.json 文件是 TypeScript 编译器的核心配置文件，它定义了编译选项和项目的源文件范围

> 官方文档： https://www.typescriptlang.org/tsconfig/

## 根选项

- **include**: 指定哪些文件或目录应该被包含在编译过程中。可以使用通配符（如 \*_/_）来匹配多个文件或目录。
- **exclude**: 指定哪些文件或目录不应该被编译。同样支持通配符。
- **files**: 明确列出需要编译的文件列表。当使用 files 时，include 和 exclude 将被忽略。
- **extends**: 允许你从另一个配置文件继承设置，从而避免重复配置。
- **references**: 用于项目引用，允许将大型项目拆分成更小的部分。

## 编译器选项 (compilerOptions)

### 基本选项

- **target**: 指定编译输出的 JavaScript 版本，例如 "ES5", "ES6", "ES2015" 等等。
- **module**: 指定模块解析方式，如 "commonjs", "amd", "system", "umd", "es2015", 或 "ESNext"。
- **lib**: 指定要包含在编译中的库文件，例如 "dom", "es6" 等。
- **allowJs**: 是否允许编译 .js 文件，默认为 false。
- **checkJs**: 是否检查 .js 文件中的错误，默认为 false。
- **jsx**: 指定 JSX 代码的处理方式，例如 "preserve", "react-native", 或 "react"。
- **declaration**: 是否生成 .d.ts 声明文件，默认为 false。
- **sourceMap**: 是否生成 .map 文件，默认为 false。
- **outFile**: 将所有全局作用域中的代码合并成一个文件。仅适用于某些模块类型。
- **outDir**: 指定输出文件夹。
- **rootDir**: 指定输入文件的根目录。

### 严格检查

- **strict**: 启用所有严格的类型检查选项，默认为 false。
- **noImplicitAny**: 禁止隐式的 any 类型，默认为 false。
- **strictNullChecks**: 启用严格的空值检查，默认为 false。
- **strictFunctionTypes**: 对函数类型的参数进行双向协变检查，默认为 false。
- **strictBindCallApply**: 对 bind, call, apply 方法启用严格检查，默认为 false。
- **strictPropertyInitialization**: 检查类属性是否已初始化，默认为 false。
- **noImplicitThis**: 禁止不明确类型的 this，默认为 false。
- **alwaysStrict**: 解析每个模块时都启用严格模式，默认为 false。

### 模块解析选项

- **moduleResolution**: 模块解析策略，例如 "node" 或 "classic"。
- **baseUrl**: 设置解析非相对模块名称的基本目录。
- **paths**: 设置基于 baseUrl 的路径映射关系。
- **typeRoots**: 指定声明文件或文件夹的路径列表。
- **types**: 指定需要包含的模块。
- **esModuleInterop**: 实现 CommonJS 和 ES 模块之间的互操作性，默认为 false。
- **allowSyntheticDefaultImports**: 允许从没有默认导出的模块中默认导入，默认为 false。

### 高级选项

- **incremental**: 启用增量编译，默认为 false。
- **composite**: 开启项目编译，默认为 false。
- **tsBuildInfoFile**: 指定增量编译信息文件的位置，需与 incremental 一起使用。
- **importHelpers**: 从 tslib 导入辅助函数，默认为 false。
- **downlevelIteration**: 支持旧版本 JavaScript 中的迭代器，默认为 false。
- **isolatedModules**: 将每个文件转换为单独的模块，默认为 false。

### Map 选项

- **sourceRoot**: 指定调试器查找 TypeScript 文件的位置。
- **mapRoot**: 指定调试器查找 .map 文件的位置。
- **inlineSourceMap**: 将 .map 文件内容嵌入到 .js 文件中，默认为 false。
- **inlineSources**: 将原始 .ts 文件的内容作为字符串嵌入到 .map 文件中，默认为 false。

### 附加检查

- **noUnusedLocals**: 检查未使用的局部变量，默认为 false。
- **noUnusedParameters**: 检查未使用的参数，默认为 false。
- **noImplicitReturns**: 检查函数是否有返回值，默认为 false。
- **noFallthroughCasesInSwitch**: 检查 switch 中是否有 case 没有使用 break，默认为 false。
- **noUncheckedIndexedAccess**: 检查索引签名访问，默认为 false。
- **noPropertyAccessFromIndexSignature**: 检查通过索引签名访问对象属性的一致性，默认为 false。

### 实验选项

- **experimentalDecorators**: 启用装饰器的支持，默认为 false。
- **emitDecoratorMetadata**: 发出装饰器元数据，默认为 false。

## 示例

```js title="tsconfig.json"
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    // 指定编译输出的 JavaScript 版本（默认为 ES3）
    "target": "ES2020",

    // 指定模块代码生成的方式（如 commonjs, es6, es2015, esnext 等）
    "module": "ESNext",

    // 指定要包含在编译中的库文件（如 dom, es2015, webworker 等）
    "lib": ["ES2020", "DOM"],

    // 启用严格类型检查选项
    "strict": true,

    // 禁止隐式的 any 类型
    "noImplicitAny": true,

    // 启用严格的空值检查
    "strictNullChecks": true,

    // 对函数类型的参数进行双向协变检查
    "strictFunctionTypes": true,

    // 对 bind, call, apply 方法启用严格检查
    "strictBindCallApply": true,

    // 检查类属性是否已初始化
    "strictPropertyInitialization": true,

    // 禁止不明确类型的 this
    "noImplicitThis": true,

    // 解析每个模块时都启用严格模式
    "alwaysStrict": true,

    // 是否允许编译 .js 文件，默认为 false
    "allowJs": true,

    // 是否检查 .js 文件中的错误，默认为 false
    "checkJs": false,

    // 指定 JSX 代码的处理方式（如 preserve, react-native, react）
    "jsx": "react",

    // 是否生成 .d.ts 声明文件，默认为 false
    "declaration": true,

    // 是否生成 source map 文件，默认为 false
    "sourceMap": true,

    // 指定输出文件夹
    "outDir": "./dist",

    // 指定输入文件的根目录
    "rootDir": "./src",

    // 设置解析非相对模块名称的基本目录
    "baseUrl": "./",

    // 设置基于 baseUrl 的路径映射关系
    "paths": {
      "@/*": ["./src/*"]
    },

    // 实现 CommonJS 和 ES 模块之间的互操作性，默认为 false
    "esModuleInterop": true,

    // 允许从没有默认导出的模块中默认导入，默认为 false
    "allowSyntheticDefaultImports": true,

    // 支持旧版本 JavaScript 中的迭代器，默认为 false
    "downlevelIteration": true,

    // 将每个文件转换为单独的模块，默认为 false
    "isolatedModules": true,

    // 启用增量编译，默认为 false
    "incremental": true,

    // 开启项目编译，默认为 false
    "composite": true,

    // 指定增量编译信息文件的位置，需与 incremental 一起使用
    "tsBuildInfoFile": "./.buildinfo",

    // 发出装饰器元数据，默认为 false
    "emitDecoratorMetadata": true,

    // 启用装饰器的支持，默认为 false
    "experimentalDecorators": true,

    // 检查未使用的局部变量，默认为 false
    "noUnusedLocals": true,

    // 检查未使用的参数，默认为 false
    "noUnusedParameters": true,

    // 检查函数是否有返回值，默认为 false
    "noImplicitReturns": true,

    // 检查 switch 中是否有 case 没有使用 break，默认为 false
    "noFallthroughCasesInSwitch": true,

    // 检查索引签名访问，默认为 false
    "noUncheckedIndexedAccess": true,

    // 检查通过索引签名访问对象属性的一致性，默认为 false
    "noPropertyAccessFromIndexSignature": true
  },

  // 指定哪些文件或目录应该被包含在编译过程中
  "include": ["src/**/*"],

  // 指定哪些文件或目录不应该被编译
  "exclude": ["node_modules", "dist"]
}
```

这些配置项可以根据项目需求进行调整，以确保最佳的开发体验和性能优化;
