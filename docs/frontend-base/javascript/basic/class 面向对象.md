# class 面向对象

---

### **JavaScript 中的 Class 详解**

JavaScript 的 `class` 是 ES6 引入的语法糖，旨在简化基于原型的面向对象编程。尽管表面类似传统面向对象语言（如 Java），但其底层仍基于原型链。以下是 `class` 的全面解析：

---

### **一、基本语法**
#### **1. 类声明**
```javascript
class Person {
  // 构造函数
  constructor(name) {
    this.name = name; // 实例属性
  }

  // 实例方法
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 静态方法
  static compare(personA, personB) {
    return personA.name === personB.name;
  }
}

// 创建实例
const alice = new Person("Alice");
alice.sayHello(); // Hello, I'm Alice

// 调用静态方法
console.log(Person.compare(alice, new Person("Bob"))); // false
```

#### **2. 类表达式**
类可以是具名或匿名表达式：
```javascript
// 匿名类表达式
const Dog = class {
  constructor(name) {
    this.name = name;
  }
};

// 具名类表达式（类名仅在内部可见）
const Cat = class MyCat {
  constructor(name) {
    this.name = name;
  }
};
```

---

### **二、核心特性**
#### **1. 构造函数 (`constructor`)**
- 每个类必须有 `constructor` 方法（未显式定义则默认生成空构造函数）。
- 通过 `new` 调用时执行，用于初始化实例属性。
- **必须使用 `new` 调用类**，否则报错。

#### **2. 实例方法与静态方法**
- **实例方法**：定义在类的原型上，供实例调用。
- **静态方法**：使用 `static` 关键字定义，直接通过类名调用，常用于工具函数。
  ```javascript
  class MathUtils {
    static sum(a, b) {
      return a + b;
    }
  }
  console.log(MathUtils.sum(1, 2)); // 3
  ```

#### **3. Getter 与 Setter**
用于拦截属性的读取和设置：
```javascript
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Setter
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(" ");
  }
}

const user = new User("John", "Doe");
console.log(user.fullName); // John Doe
user.fullName = "Jane Smith";
console.log(user.firstName); // Jane
```

---

### **三、继承 (`extends` 与 `super`)**
#### **1. 基本继承**
```javascript
class Student extends Person {
  constructor(name, grade) {
    super(name); // 调用父类构造函数
    this.grade = grade;
  }

  // 重写父类方法
  sayHello() {
    super.sayHello(); // 调用父类方法
    console.log(`I'm in grade ${this.grade}`);
  }
}

const student = new Student("Bob", 5);
student.sayHello(); 
// Hello, I'm Bob
// I'm in grade 5
```

#### **2. `super` 关键字**
- **构造函数中**：`super()` 必须在使用 `this` 前调用，否则报错。
- **方法中**：`super.method()` 调用父类方法。

#### **3. 继承内置类型**
可继承 `Array`、`Error` 等内置类型：
```javascript
class CustomArray extends Array {
  get last() {
    return this[this.length - 1];
  }
}

const arr = new CustomArray(1, 2, 3);
console.log(arr.last); // 3
```

---

### **四、静态属性与实例属性**
#### **1. 静态属性**
ES13 (ES2022) 支持直接在类中声明静态属性：
```javascript
class Config {
  static version = "1.0.0";
}
console.log(Config.version); // 1.0.0
```

#### **2. 实例属性**
可在构造函数外直接声明（ES13+）：
```javascript
class Rectangle {
  width = 0; // 实例属性
  height = 0;

  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}
```

---

### **五、私有成员（ES13+）**
使用 `#` 前缀定义私有字段和方法：
```javascript
class Counter {
  #count = 0; // 私有字段

  // 私有方法
  #increment() {
    this.#count++;
  }

  tick() {
    this.#increment();
    console.log(this.#count);
  }
}

const counter = new Counter();
counter.tick(); // 1
counter.#count; // ❌ 报错：私有字段无法外部访问
```

---

### **六、注意事项与技巧**
#### **1. 方法的不可枚举性**
类中定义的方法默认不可枚举（不同于 ES5 的原型方法）：
```javascript
class Example {
  method() {}
}
console.log(Object.keys(new Example())); // []
```

#### **2. `new.target` 属性**
在构造函数中检测调用方式：
```javascript
class Parent {
  constructor() {
    if (new.target === Parent) {
      console.log("直接实例化 Parent");
    }
  }
}

class Child extends Parent {}

new Parent(); // 直接实例化 Parent
new Child();  // 无输出
```

#### **3. 避免箭头函数方法**
箭头函数方法会导致 `this` 绑定问题：
```javascript
class BadExample {
  value = 42;
  getValue = () => this.value; // ❌ 箭头函数作为实例方法
}

const obj = new BadExample();
const { getValue } = obj;
console.log(getValue()); // 42（看似正常，但占用更多内存）
```

---

### **七、与传统原型的对比**
| **特性**           | **Class**                          | **构造函数 + 原型**                 |
|---------------------|------------------------------------|-------------------------------------|
| **语法清晰度**      | 高，结构直观                      | 低，代码分散                        |
| **继承实现**        | `extends` + `super` 简洁          | 手动设置原型链（`Child.prototype = Object.create(Parent.prototype)`） |
| **方法可枚举性**    | 不可枚举                          | 可枚举（需通过 `Object.defineProperty` 设置） |
| **静态成员**        | 直接通过 `static` 声明            | 手动添加到构造函数（如 `MyConstructor.staticMethod = ...`） |

---

### **八、总结**
- **`class` 的本质**：基于原型的语法糖，提供更清晰的面向对象语法。
- **核心功能**：构造函数、实例/静态方法、继承、getter/setter、私有成员（ES13+）。
- **适用场景**：复杂对象建模、框架开发、需要明确继承关系的场景。
- **注意事项**：必须使用 `new` 调用、`super` 调用顺序、私有字段兼容性。

通过 `class`，JavaScript 的面向对象编程变得更直观和强大，适合构建可维护的大型应用。