# TypeScript: Understanding `interface`, `type`, and `enum`

## 1. `interface`

### Description:

An `interface` in TypeScript defines the **structure of an object**. It is used for describing the shape of an object, especially for class definitions and complex object hierarchies.

### Use cases:

- Defining object contracts
- Modeling class structures
- Extending existing object shapes

### Example:

```ts
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const newUser: User = {
  id: 1,
  name: "Alice",
  isActive: true,
};
```

### Extension Example:

```ts
interface Person {
  name: string;
}

interface Employee extends Person {
  id: number;
  department: string;
}
```

### ⚠️ Notes:

- Suitable only for object-like structures
- Supports **declaration merging**, allowing multiple interface declarations to be combined
- Interfaces can be implemented by classes

---

## 2. `type`

### Description:

A `type` alias in TypeScript defines a name for any valid type including **primitive**, **union**, **intersection**, **tuples**, and even **functions**.

### Use cases:

- Creating union and intersection types
- Alias for primitive types or complex objects
- Representing utility types and mapped structures

### Example:

```ts
type Status = "success" | "error" | "loading";

type User = {
  id: number;
  name: string;
};

type Employee = User & {
  department: string;
};
```

### Combination Examples:

```ts
type ID = number | string;
type Callback = () => void;
```

### ⚠️ Notes:

- More versatile than `interface`
- Does **not** support declaration merging
- Preferable for advanced types (e.g., unions, tuples)

---

## 3. `enum`

### Description:

An `enum` is a way to define a set of named constants. These constants can be either **numeric** or **string-based**.

### Use cases:

- Defining a fixed set of possible values (e.g., states, roles, categories)
- Better readability and maintainability for constant groups

### Numeric Enum Example:

```ts
enum Role {
  Admin,
  Editor,
  Viewer,
}

const userRole: Role = Role.Admin;
```

### String Enum Example:

```ts
enum Status {
  Success = "success",
  Error = "error",
  Loading = "loading",
}
```

### ⚠️ Notes:

- Values can be numeric (default) or explicitly set to strings
- Transpiles into actual JS objects (runtime presence)
- 🛑 Can increase bundle size if overused

---

## Comparison: `interface` vs `type` vs `enum`

| Feature                     | `interface` | `type`                 | `enum` |
| --------------------------- | ----------- | ---------------------- | ------ |
| Describes object shape      | Yes         | Yes                    | No     |
| Supports union/intersection | No          | Yes                    | No     |
| Extendable                  | Yes         | Yes (via intersection) | No     |
| Declaration merging         | Yes         | No                     | No     |
| Can represent primitives    | No          | Yes                    | No     |
| Exists at runtime           | No          | No                     | Yes    |
| Ideal for constants         | No          | Sometimes (unions)     | Yes    |

---

## Dos and Don’ts

### ✅ Dos

- Use `interface` when modeling object shapes and class structures
- Use `type` for unions, intersections, or aliasing more complex or primitive types
- Use `enum` for a clear and controlled set of constants that require runtime presence
- Prefer `type` over `enum` when runtime values are not necessary

### ❌ Don’ts

- Don’t use `enum` if a simple union of strings would suffice
- Don’t use `interface` for things other than objects
- Don’t use `type` for everything—use it where its strengths apply

---

## Practice Tips

- ✍️ Convert an object `type` into an `interface` and vice versa
- 🔄 Model user roles with both union `type` and `enum` and compare
- 🧩 Create a reusable function that accepts only a specific type using an interface
- 🧪 Explore extending and combining `interface` and `type`

---

## 📚 Reading Materials

### Interfaces

- [TypeScript Official Handbook – Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Prismic Guide to Interfaces](https://prismic.io/blog/typescript-interfaces)

### Type vs Interface

- [Stack Overflow Thread](https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types)

### Enums

- [Refine.dev on Advanced Enums](https://refine.dev/blog/typescript-enum/)

### Combined Topics

- [Dev.to – Unlocking TypeScript’s Power](https://dev.to/molly/typescript-type-vs-interface-vs-enum-5gke)

### Video

- [YouTube – TypeScript Tutorial #15 - Interfaces](https://www.youtube.com/watch?v=7f4dzkpMJfM)
