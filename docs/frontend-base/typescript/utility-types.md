# Utility Types

TypeScript 提供了一组内置的工具类型（Utility Types），用于在现有类型的基础上创建新的类型。这些工具类型可以简化常见的类型转换和操作，提高代码的可读性和复用性。以下是 TypeScript 中主要的 Utility Types 的详细说明：

### 1. `Partial<T>`

将 `T` 中的所有属性变为可选。

```typescript
type PartialPerson = Partial<{ name: string; age: number }>;
// 结果: { name?: string; age?: number }
```

### 2. `Required<T>`

将 `T` 中的所有属性变为必须。

```typescript
type RequiredPerson = Required<{ name?: string; age?: number }>;
// 结果: { name: string; age: number }
```

### 3. `Readonly<T>`

将 `T` 中的所有属性变为只读。

```typescript
type ReadonlyPerson = Readonly<{ name: string; age: number }>;
// 结果: { readonly name: string; readonly age: number }
```

### 4. `Record<K, T>`

构建一个新类型，该类型的键来自 `K` 类型，值为 `T` 类型。

```typescript
type StringMap = Record<string, string>;
// 结果: { [key: string]: string }

const user: StringMap = {
  name: "Alice",
  role: "Developer"
};`
```

### 5. `Pick<T, K>`

从 `T` 中选择指定的属性 `K`，构造一个新的类型。

```typescript
type PickUser = Pick<{ name: string; age: number; role: string }, "name" | "age">;
// 结果: { name: string; age: number }
```

### 6. `Omit<T, K>`

从 `T` 中排除指定的属性 `K`，构造一个新的类型。

```typescript
type OmitUser = Omit<{ name: string; age: number; role: string }, "role">;
// 结果: { name: string; age: number }
```

### 7. `Exclude<T, U>`

从 `T` 中排除可以赋值给 `U` 的类型。

```typescript
type ExcludeTypes = Exclude<"a" | "b" | "c", "a" | "b">;
// 结果: "c"
```

### 8. `Extract<T, U>`

从 `T` 中提取可以赋值给 `U` 的类型。

```typescript
type ExtractTypes = Extract<"a" | "b" | "c", "a" | "f">;
// 结果: "a"
```

### 9. `NonNullable<T>`

从 `T` 中移除 `null` 和 `undefined`。

```typescript
type NonNullableTypes = NonNullable<string | number | null | undefined>;
// 结果: string | number
```

### 10. `Parameters<T>`

获取函数类型 `T` 的参数类型，返回一个元组类型。

```typescript
type ParamTypes = Parameters<(name: string, age: number) => void>;
// 结果: [name: string, age: number]
```

### 11. `ConstructorParameters<T>`

获取构造函数类型 `T` 的参数类型，返回一个元组类型。

```typescript
type ConstructorParamTypes = ConstructorParameters<new (name: string, age: number) => any>;
// 结果: [name: string, age: number]
```

### 12. `ReturnType<T>`

获取函数类型 `T` 的返回值类型。

```typescript
type ReturnTypes = ReturnType<() => string>;
// 结果: string
```

### 13. `InstanceType<T>`

获取构造函数类型 `T` 的实例类型。

```typescript
class C {}
type InstanceTypes = InstanceType<typeof C>;
// 结果: C
```

### 14. `ThisParameterType<T>` 和 `OmitThisParameter<T>`

- **`ThisParameterType<T>`**: 获取函数类型 `T` 的 this 参数类型。
- **`OmitThisParameter<T>`**: 移除函数类型 `T` 的 this 参数。

```typescript
function foo(this: HTMLElement, id: string) {}
type ThisParamType = ThisParameterType<typeof foo>; // HTMLElement
type NoThisParamType = OmitThisParameter<typeof foo>; // (id: string) => void
```

### 15. `Awaited<T>`

递归地解包 Promise 类型。

```typescript
type AwaitedType = Awaited<Promise<Promise<string>>>;
// 结果: string
```

### 16. `ExcludeKeys<T, K>`

从 `T` 中排除指定的键 `K`，并返回剩下的键组成的联合类型。

```typescript
type ExcludeKeys = Exclude<keyof { a: number; b: string; c: boolean }, "c">;
// 结果: "a" | "b"
```

### 使用场景

- **简化类型定义**：使用工具类型可以快速定义复杂的类型结构，而不需要重复编写相同的类型声明。
- **提升代码可维护性**：通过组合和变换现有类型，减少硬编码类型定义，使得代码更易于维护和更新。
- **增强类型安全性**：确保编译器能够正确推断出类型信息，避免潜在的运行时错误。

这些工具类型是 TypeScript 强大类型系统的一部分，它们不仅增强了语言的表达能力，还提供了更高的灵活性和便捷性。熟练掌握这些工具类型可以帮助开发者写出更加健壮、易维护的 TypeScript 代码。