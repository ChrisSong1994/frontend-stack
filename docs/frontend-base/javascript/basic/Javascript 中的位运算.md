# Javascript 中的位运算

### 1. 按位与（&）
按位与运算对两个数的每一位执行逻辑与操作。只有当两位都为1时，结果该位才为1。

```javascript
let a = 5; // 二进制: 0101
let b = 7; // 二进制: 0111
console.log(a & b); // 输出: 5 (0101)
```

### 2. 按位或（|）
按位或运算对两个数的每一位执行逻辑或操作。只要有一位为1，结果该位就为1。

```javascript
let a = 5; // 二进制: 0101
let b = 7; // 二进制: 0111
console.log(a | b); // 输出: 7 (0111)
```

### 3. 按位异或（^）
按位异或运算对两个数的每一位执行逻辑异或操作。只有当两位不同时，结果该位才为1。

```javascript
let a = 5; // 二进制: 0101
let b = 7; // 二进制: 0111
console.log(a ^ b); // 输出: 2 (0010)
```

### 4. 按位取反（~）
按位取反运算对一个数的每一位执行逻辑非操作。将所有位取反，0变为1，1变为0。

```javascript
let a = 5; // 二进制: 0101
console.log(~a); // 输出: -6 (二进制: 11111010)
```

### 5. 左移（<<）
左移运算将一个数的二进制表示向左移动指定的位数，并在右边填充零。

```javascript
let a = 5; // 二进制: 0101
console.log(a << 2); // 输出: 20 (二进制: 10100)
```

### 6. 右移（>>）
右移运算将一个数的二进制表示向右移动指定的位数，并在左边填充零（对于无符号右移）或符号位（有符号右移）。

```javascript
let a = 8; // 二进制: 1000
console.log(a >> 2); // 输出: 2 (二进制: 0010)
```

### 应用场景

- **数据掩码**：使用按位与运算来保留数字的某些特定位，例如提取IP地址的部分。

```javascript
let ip = 192 << 8 | 168 << 16 | 1;
ip = (ip & 0xFF) << 8 | (ip >> 16) & 0xFF;
```

- **优化计算**：使用位移来代替乘法或除法运算，提高效率。

```javascript
let multipliedBy8 = num << 3; // 相当于 num * 8
let dividedBy4 = num >> 2;    // 相当于 num / 4
```

- **交换变量值**：利用按位异或来交换两个变量的值，而无需使用临时变量。

```javascript
let a = 5, b = 7;
a = a ^ b;
b = a ^ b;
a = a ^ b; // 现在 a 和 b 的值互换
```

### 注意事项

- **符号位处理**：JavaScript中的数字使用二进制补码表示，因此在处理负数时，右移运算会填充1而不是0。

```javascript
console.log(-5 >> 2); // 输出: -2 (因为 JavaScript 使用有符号右移)
```

- **数值范围限制**：位运算在32位整数上执行，超过这个范围的数字可能会被截断或出现不可预测的结果。

### 总结

JavaScript中的位运算符提供了对数字二进制表示的操作能力，适用于数据掩码、优化计算和变量交换等多种场景。理解这些运算符的工作原理及其应用场景，可以帮助我们更高效地编写代码，并提升程序性能。