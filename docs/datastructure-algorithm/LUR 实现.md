# LUR 实现

以下是使用 JavaScript 实现的 **LRU 缓存**，结合 `Map` 和双向链表实现 O(1) 时间复杂度操作，并附带详细注释：

```javascript
class DLinkedNode {
  constructor(key, value) {
    this.key = key;       // 键
    this.value = value;   // 值
    this.prev = null;     // 前驱指针
    this.next = null;     // 后继指针
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;   // 缓存容量
    this.size = 0;              // 当前缓存大小
    this.cache = new Map();     // 哈希表，存储键到节点的映射
    // 初始化头尾哨兵节点，简化边界操作
    this.head = new DLinkedNode(-1, -1);
    this.tail = new DLinkedNode(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 获取键对应的值，并更新节点位置
  get(key) {
    if (!this.cache.has(key)) return -1;
    const node = this.cache.get(key);
    this.moveToHead(node);  // 将节点移动到链表头部
    return node.value;
  }

  // 插入或更新键值对
  put(key, value) {
    if (this.cache.has(key)) {
      // 键已存在：更新值并移到头部
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // 键不存在：创建新节点
      const node = new DLinkedNode(key, value);
      this.cache.set(key, node);
      this.addToHead(node); // 添加到链表头部
      this.size++;
      // 若超出容量，移除尾部节点
      if (this.size > this.capacity) {
        const removed = this.removeTail();
        this.cache.delete(removed.key);
        this.size--;
      }
    }
  }

  // 将节点添加到链表头部
  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // 从链表中移除节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // 移动节点到头部
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  // 移除并返回尾部节点（最近最少使用）
  removeTail() {
    const node = this.tail.prev; // 尾部哨兵的前一个节点
    this.removeNode(node);
    return node;
  }
}

// 测试用例
const lru = new LRUCache(2);
lru.put(1, 1);         // 缓存 {1=1}
lru.put(2, 2);         // 缓存 {1=1, 2=2}
console.log(lru.get(1)); // 返回 1，缓存变为 {2=2, 1=1}
lru.put(3, 3);         // 移除键 2，缓存 {1=1, 3=3}
console.log(lru.get(2)); // 返回 -1 (未找到)
lru.put(4, 4);         // 移除键 1，缓存 {3=3, 4=4}
console.log(lru.get(1)); // 返回 -1 (未找到)
console.log(lru.get(3)); // 返回 3
console.log(lru.get(4)); // 返回 4
```

---

### **实现关键点解析**

| 核心机制              | 实现细节                                                                 |
|-----------------------|--------------------------------------------------------------------------|
| **数据结构选择**      | `Map` 存储键值映射，双向链表维护使用顺序                                   |
| **哨兵节点**          | 头尾虚拟节点简化链表操作，避免处理 `null` 边界情况                        |
| **时间复杂度**        | `get` 和 `put` 均为 O(1)                                                 |
| **容量控制**          | 插入新节点时检查容量，超出则移除链表尾部节点（LRU）                       |
| **节点移动策略**      | 每次访问或更新节点时，将其移动到链表头部，表示最近使用                    |

---

### **性能优化对比**

| 方法                | 时间复杂度 | 空间复杂度 | 适用场景                     |
|---------------------|------------|------------|------------------------------|
| **数组 + 对象**     | O(n)       | O(n)       | 简单场景，数据量小           |
| **Map + 双向链表**  | O(1)       | O(n)       | 高频访问，要求高效淘汰策略   |
| **纯 Map 实现**     | O(1)*      | O(n)       | 需要简洁代码，但无法严格保证 LRU 顺序 |

> *注：纯 `Map` 实现（利用其插入顺序特性）在读取时需要删除并重新插入键来模拟 LRU，严格来说不符合规范。

---

### **边界情况处理**

1. **容量为 0 或 1**
   ```javascript
   const lru0 = new LRUCache(0);
   lru0.put(1, 1); // 直接丢弃
   console.log(lru0.get(1)); // -1

   const lru1 = new LRUCache(1);
   lru1.put(1, 1);
   lru1.put(2, 2); // 移除键 1
   console.log(lru1.get(1)); // -1
   ```

2. **重复插入相同键**
   ```javascript
   const lru = new LRUCache(2);
   lru.put(1, 100);
   lru.put(1, 200); // 更新值并移到头部
   console.log(lru.get(1)); // 200
   ```

---

### **可视化操作流程**

```
操作步骤          链表状态（头 → 尾）       Map 键
---------------------------------------------------------
put(1,1)        [1]                     {1}
put(2,2)        [2] ↔ [1]               {1, 2}
get(1)          [1] ↔ [2]               {1, 2}
put(3,3)        [3] ↔ [1]               {1, 3}  (移除2)
put(4,4)        [4] ↔ [3]               {3, 4}  (移除1)
```

---

### **进阶优化方向**

1. **使用 WeakRef 防止内存泄漏**
   ```javascript
   // 若键是对象类型，可使用 WeakMap
   const cache = new WeakMap(); 
   ```

2. **批量操作优化**
   ```javascript
   // 在多次 put 操作后延迟触发淘汰逻辑
   // 需根据业务场景调整
   ```

3. **TypeScript 强化类型**
   ```typescript
   interface DLinkedNode<T> {
     key: number;
     value: T;
     prev: DLinkedNode<T> | null;
     next: DLinkedNode<T> | null;
   }
   ```

---

通过这种实现方式，LRU 缓存在 JavaScript 中能够高效处理高频数据访问场景，同时保证内存使用的可控性。