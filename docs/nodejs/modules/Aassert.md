# Assert

以下是基于 Node.js 最新版本（如 20.x 或更高）的 `assert` 模块详细介绍，涵盖新特性、更新内容和最佳实践：

### **1. 模块引入与严格模式**
- **默认严格模式**：  
  在最新版本中，推荐直接使用 `require('assert').strict`，或直接引入严格模式方法。部分方法在非严格模式下可能已被标记为遗留（Legacy）。
  ```javascript
  const assert = require('assert').strict;
  // 或按需引入特定方法
  const { strictEqual, deepStrictEqual } = require('assert');
  ```

### **2. 核心方法与更新**

#### **2.1 基础断言**
- **`assert.ok(value[, message])`**  
  验证 `value` 是否为真值（Truthy）。若为假值（Falsy），抛出带有 `message` 的 `AssertionError`。  
  **更新**：错误消息现在会显示 `value` 的实际值，便于调试。

- **`assert.fail([message])`**  
  直接抛出错误。支持传递 `Error` 对象作为参数：  
  ```javascript
  assert.fail(new Error('Custom error')); // 抛出指定错误对象
  ```

#### **2.2 相等性断言**
- **`assert.equal(actual, expected[, message])`**（遗留方法）  
  使用 `==` 比较，但在严格模式下已被废弃，建议改用 `assert.strictEqual`。

- **`assert.strictEqual(actual, expected[, message])`**  
  严格比较（`===`），类型和值必须一致。

- **`assert.deepEqual(actual, expected[, message])`**（遗留方法）  
  深度宽松比较（允许类型转换），在严格模式下不推荐使用。

- **`assert.deepStrictEqual(actual, expected[, message])`**  
  严格深度比较，支持复杂类型（如 `Buffer`, `Date`, `Map`, `Set`, `TypedArray`）的结构化对比。  
  **更新**：对 `Symbol` 属性、`BigInt` 和循环引用的对象有更精确的处理。

- **新增 `assert.notStrictEqual` 与 `assert.notDeepStrictEqual`**  
  验证值不严格相等或结构不严格相等：
  ```javascript
  assert.notStrictEqual(1, '1'); // 通过（1 !== '1'）
  ```

#### **2.3 异常与异步断言**
- **`assert.throws(fn, [error][, message])`**  
  支持验证错误类型、消息或自定义校验函数：
  ```javascript
  assert.throws(
    () => { throw new TypeError('Invalid input'); },
    {
      name: 'TypeError',
      message: /Invalid/
    }
  );
  ```

- **`assert.rejects(asyncFn, error[, message])`**  
  验证 `Promise` 是否被拒绝（Reject），支持 `async/await`：
  ```javascript
  await assert.rejects(
    async () => { throw new Error('Fail'); },
    Error
  );
  ```

- **`assert.doesNotThrow(fn[, message])`**  
  确保函数不抛出错误，但对异步错误无效（需结合 `async/await`）。

#### **2.4 其他增强方法**
- **`assert.match(string, regexp[, message])`**  
  验证字符串匹配正则表达式：
  ```javascript
  assert.match('Hello Node.js', /Node/);
  ```

- **`assert.doesNotMatch(string, regexp[, message])`**  
  验证字符串不匹配正则表达式。

- **`assert.CallTracker`（实验性）**  
  用于跟踪函数调用次数（需谨慎使用，可能在未来的版本中变更）：
  ```javascript
  const tracker = new assert.CallTracker();
  const func = tracker.calls(2); // 期望调用2次
  func();
  func();
  tracker.verify(); // 验证调用次数
  ```

### **3. 错误消息改进**
最新版本的 `assert` 模块在断言失败时生成更详细的错误信息，例如：
- **差异对比**：`assert.strictEqual` 或 `deepStrictEqual` 失败时会显示实际值与期望值的差异。
- **上下文信息**：包含代码行号、输入值的类型和内容。

### **4. 严格模式的新特性**
- **默认严格化**：部分宽松方法（如 `equal`, `deepEqual`）在严格模式下已移除，直接调用会抛出警告或错误。
- **类型安全**：严格方法（如 `strictEqual`）对 `NaN`, `+0/-0`, 和对象引用的处理更符合 ECMAScript 规范。

### **5. 使用场景与最佳实践**
- **单元测试**：结合测试框架（如 `node:test`，Node.js 18+ 内置）编写测试用例。
  ```javascript
  const { test } = require('node:test');
  test('Example test', () => {
    assert.strictEqual(1 + 1, 2);
  });
  ```
- **类型检查**：验证函数参数或返回值的类型和结构。
- **防御性编程**：在关键路径插入断言，确保代码假设成立。

### **6. 示例代码（最新语法）**
```javascript
const assert = require('assert').strict;

// 严格类型与值检查
assert.strictEqual(42, 42);
assert.notStrictEqual(42, '42');

// 深度严格比较（支持 Map/Set）
const map1 = new Map([['a', 1]]);
const map2 = new Map([['a', 1]]);
assert.deepStrictEqual(map1, map2);

// 异步错误断言
await assert.rejects(
  async () => { throw new RangeError('Out of bounds'); },
  RangeError
);

// 正则匹配
assert.match('Node.js v20', /v20/);
```

### **7. 注意事项**
- **性能影响**：生产环境建议移除断言代码（可通过构建工具过滤）。
- **错误处理**：避免在异步回调中遗漏错误断言，推荐使用 `assert.rejects`。
- **弃用方法**：定期检查 Node.js 文档，替换已弃用的方法（如 `equal`）。

### **8. 与其他测试框架对比**
虽然 `assert` 模块轻量，但专业框架（如 Jest、Mocha）提供更丰富的功能：
- **快照测试**：Jest 的 `toMatchSnapshot`。
- **模拟和桩函数**：Jest 的 `jest.fn()`。
- **测试覆盖率**：通过 `c8` 或 `nyc` 生成。

通过结合 Node.js 最新版本的 `assert` 模块和内置测试工具（如 `node:test`），开发者可以构建高效且现代化的测试流程。