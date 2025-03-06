
# Crypto 加密模块

**Crypto** 是 Node.js 的核心模块，用于实现各种加密功能，包括哈希、HMAC、加密/解密、数字签名、密钥管理等。它是构建安全应用的基石，适用于密码存储、数据传输加密、身份验证等场景。

### **1. 模块引入**
```javascript
const crypto = require('crypto');
```

### **2. 核心功能**

#### **2.1 哈希（Hash）**
哈希将任意长度数据转换为固定长度的唯一值（不可逆），常用于密码存储或数据完整性验证。

**支持算法**：`SHA-256`, `SHA-512`, `MD5`（不推荐）, `RIPEMD160` 等。

**示例：计算 SHA-256 哈希**
```javascript
const hash = crypto.createHash('sha256');
hash.update('Hello World'); // 输入数据
console.log(hash.digest('hex')); // 输出：a591a6d40bf420...
```

**注意**：`MD5` 和 `SHA-1` 已被证明不安全，建议使用 `SHA-256` 或更高强度算法。

#### **2.2 HMAC（密钥哈希消息认证码）**
HMAC 结合密钥和哈希算法，用于验证数据完整性和真实性（防篡改）。

**示例：HMAC-SHA256**
```javascript
const secret = 'my-secret-key';
const hmac = crypto.createHmac('sha256', secret);
hmac.update('敏感数据');
console.log(hmac.digest('base64')); // 输出签名
```

#### **2.3 对称加密/解密（AES、DES 等）**
对称加密使用同一密钥加密和解密数据，适合高效加密大量数据。

**支持算法**：`AES-256-CBC`, `AES-128-GCM`, `DES`（不推荐）等。

**示例：AES-256-CBC 加密解密**
```javascript
// 加密
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256位密钥
const iv = crypto.randomBytes(16); // 初始化向量
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello World', 'utf8', 'hex');
encrypted += cipher.final('hex');

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted); // Hello World
```

**关键点**：
- **IV（初始化向量）**：必须随机且唯一，可明文传输。
- **加密模式**：推荐使用 **GCM**（认证加密）而非 **CBC**（需单独处理认证）。

#### **2.4 非对称加密（RSA、ECC）**
非对称加密使用公钥加密、私钥解密，适用于密钥交换或数字签名。

**示例：RSA 加密解密**
```javascript
// 生成密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096, // 密钥长度
});

// 加密
const encrypted = crypto.publicEncrypt(
  publicKey,
  Buffer.from('Secret Message')
);

// 解密
const decrypted = crypto.privateDecrypt(
  privateKey,
  encrypted
);
console.log(decrypted.toString()); // Secret Message
```

#### **2.5 数字签名与验证**
确保数据来源真实性和完整性，私钥签名，公钥验证。

**示例：RSA 签名**
```javascript
// 签名
const sign = crypto.createSign('SHA256');
sign.update('data to sign');
const signature = sign.sign(privateKey, 'hex');

// 验证
const verify = crypto.createVerify('SHA256');
verify.update('data to sign');
const isValid = verify.verify(publicKey, signature, 'hex');
console.log(isValid); // true
```

#### **2.6 密码哈希（PBKDF2、scrypt）**
安全存储用户密码，抵御暴力破解。

**示例：PBKDF2 哈希密码**
```javascript
const password = 'user-password';
const salt = crypto.randomBytes(16); // 随机盐值
const iterations = 100000; // 迭代次数
const keylen = 64; // 输出长度
const digest = 'sha512';

const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
console.log(hash.toString('hex'));
```

**推荐参数**：
- 迭代次数 ≥ 100,000
- 盐值长度 ≥ 16 字节
- 使用 `scrypt` 算法（更抗 GPU 破解）

#### **2.7 随机数生成**
生成加密安全的随机数据，用于密钥、盐值或 IV。

```javascript
const buffer = crypto.randomBytes(32); // 生成32字节随机数据
console.log(buffer.toString('hex'));
```

### **3. 实用工具方法**

| **方法**                     | **说明**                           |
|------------------------------|-----------------------------------|
| `crypto.getCiphers()`         | 获取支持的对称加密算法列表         |
| `crypto.getHashes()`          | 获取支持的哈希算法列表             |
| `crypto.timingSafeEqual(a, b)`| 安全比较两个缓冲区（防时序攻击）   |

### **4. 安全最佳实践**

1. **密钥管理**：
   - 使用 `crypto.randomBytes` 生成强密钥。
   - 避免硬编码密钥，通过环境变量或密钥管理系统（如 Vault）存储。

2. **算法选择**：
   - 对称加密：优先选择 `AES-256-GCM`。
   - 哈希密码：使用 `pbkdf2` 或 `scrypt`，而非纯哈希。
   - 非对称加密：RSA 密钥长度 ≥ 2048 位，推荐 ECC（更高效）。

3. **错误处理**：
   - 加密/解密时捕获异常，防止敏感信息泄露（如填充错误）。

4. **认证加密**：
   - 使用 GCM 等模式，确保数据完整性和真实性。

### **5. 示例：完整加密流程（AES-GCM）**
```javascript
const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12); // GCM推荐12字节IV

// 加密
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return { encrypted, iv: iv.toString('hex'), authTag };
}

// 解密
function decrypt(encrypted, iv, authTag) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 使用
const { encrypted, iv, authTag } = encrypt('Secret Data');
console.log(decrypt(encrypted, iv, authTag)); // Secret Data
```

### **6. 常见问题**

**Q1: 如何安全存储加密密钥？**
- 使用硬件安全模块（HSM）或云服务（如 AWS KMS）。
- 开发环境可通过环境变量或加密配置文件存储。

**Q2: 如何处理加密后的数据传输？**
- 将 IV、盐值等非敏感参数与加密数据一起传输（如 JSON 格式）。
- 使用 HTTPS 确保传输层安全。

**Q3: 为什么推荐使用 GCM 模式？**
- GCM 提供认证加密（AEAD），同时保障机密性和完整性。
- CBC 需额外处理 MAC（消息认证码），易出错。

### **总结**
Node.js 的 Crypto 模块提供了全面的加密工具链，正确使用可显著提升应用安全性。开发者需结合具体场景选择算法，遵循密钥管理规范，并定期更新依赖以应对潜在漏洞。对于复杂场景（如 TLS 通信），建议结合 `tls` 模块或第三方库（如 `openssl`）实现更高级的安全协议。