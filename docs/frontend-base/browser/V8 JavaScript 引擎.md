# V8 JavaScript 引擎
> 引用 [Node.js 文档](https://nodejs.org/zh-cn/learn/getting-started/the-v8-javascript-engine)

V8 是 Google Chrome 的 JavaScript 引擎名称。在使用 Chrome 浏览时，它会获取并执行 JavaScript。

V8 是 JavaScript 引擎，即它解析并执行 JavaScript 代码。DOM 和其他 Web 平台 API（它们都构成了运行时环境）由浏览器提供。

很酷的是，JavaScript 引擎独立于托管它的浏览器。这一关键特性促成了 Node.js 的崛起。V8 于 2009 年被选为 Node.js 的引擎，随着 Node.js 的流行度激增，V8 成为现在为大量用 JavaScript 编写的服务器端代码提供支持的引擎。

Node.js 生态系统非常庞大，这要归功于 V8，它还为桌面应用程序和 Electron 等项目提供支持。

## [其他 JS 引擎](https://nodejs.org/zh-cn/learn/getting-started/the-v8-javascript-engine#other-js-engines)
其他浏览器有自己的 JavaScript 引擎：

+ Firefox 有[SpiderMonkey](https://spidermonkey.dev/)
+ Safari 有[JavaScriptCore](https://developer.apple.com/documentation/javascriptcore)（也称为 Nitro）
+ Edge 最初基于[Chakra](https://github.com/Microsoft/ChakraCore)，但最近[使用 Chromium](https://support.microsoft.com/en-us/help/4501095/download-the-new-microsoft-edge-based-on-chromium)和 V8 引擎重建。

还有许多其他的。

所有这些引擎都实现了[ECMA ES-262 标准](https://www.ecma-international.org/publications/standards/Ecma-262.htm)，也称为 ECMAScript，即 JavaScript 使用的标准。

## [性能](https://nodejs.org/zh-cn/learn/getting-started/the-v8-javascript-engine#the-quest-for-performance)
V8 是用 C++ 编写的，并且不断得到改进。它具有可移植性，可在 Mac、Windows、Linux 和其他几种系统上运行。

在这篇 V8 介绍中，我们将忽略 V8 的实现细节：它们可以在更权威的网站上找到（例如[V8 官方网站](https://v8.dev/)），并且它们会随着时间的推移而发生变化，而且通常会发生彻底的变化。

与其他 JavaScript 引擎一样，V8 也在不断发展，以加速 Web 和 Node.js 生态系统的速度。

在网络上，性能竞赛已经持续了好几年，我们（作为用户和开发者）从这场竞争中受益匪浅，因为我们年复一年地获得更快、更优化的机器。

## [编译](https://nodejs.org/zh-cn/learn/getting-started/the-v8-javascript-engine#compilation)
JavaScript 通常被认为是一种解释型语言，但现代 JavaScript 引擎不再只是解释 JavaScript，还对其进行编译。

这种情况从 2009 年就开始了，当时 SpiderMonkey JavaScript 编译器被添加到 Firefox 3.5 中，每个人都遵循了这个想法。

JavaScript 由 V8 内部编译，采用**即时**（JIT）**编译**来加快执行速度。

这看起来可能有悖常理，但自 2004 年推出 Google 地图以来，JavaScript 已经从一种通常执行几十行代码的语言发展成为在浏览器中运行的包含数千到数十万行代码的完整应用程序。

我们的应用程序现在可以在浏览器中运行数小时，而不仅仅是一些表单验证规则或简单的脚本。

在这个_新世界_中，编译 JavaScript 非常有意义，因为尽管可能需要花费更多时间才能_准备好_JavaScript ，但一旦完成，它的性能将比纯粹解释的代码高得多。

