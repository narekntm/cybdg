## ✅ Mocha Test Structure Overview

Mocha provides a **BDD (Behavior-Driven Development)** interface using functions like `describe`, `context`, `it`, and test lifecycle hooks such as `before`, `after`, `beforeEach`, `afterEach`.

These functions are globally available in Cypress test files.

---

## 🔧 Core Functions and Hooks

### ### `describe()` and `context()`

* Both are **functionally identical**, used to **group related tests**.
* `context` is just an alias for `describe` (used for readability, e.g., "given X context").

```js
describe('Login Tests', () => {
  it('should show error on wrong password', () => {
    // test code
  });
});

context('When user is admin', () => {
  // grouped tests
});
```

### ### `it()`

* Represents an individual **test case** (i.e., “spec”).
* Inside it, you write your test steps.
* You can **skip or exclusively run** tests:

  * `it.skip('description')`: skips test
  * `it.only('description')`: runs only this test

```js
it('should log in with valid credentials', () => {
  // test logic
});
```

### ### Test Hooks

These control test **setup and teardown logic**.

| Hook           | Runs                                   |
| -------------- | -------------------------------------- |
| `before()`     | Once before **all tests** in the block |
| `after()`      | Once after **all tests** in the block  |
| `beforeEach()` | Before **each** `it` block             |
| `afterEach()`  | After **each** `it` block              |

```js
describe('User Management', () => {
  before(() => {
    // Runs once before all tests
  });

  after(() => {
    // Runs once after all tests
  });

  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Runs after each test
  });

  it('creates a user', () => {});
  it('deletes a user', () => {});
});
```

---

## 📚 Nesting and Structure

Mocha allows **nested `describe` or `context` blocks**, enabling you to organize test suites hierarchically.

```js
describe('E-commerce Site', () => {
  before(() => {
    cy.visit('/');
  });

  context('Product Page', () => {
    beforeEach(() => {
      cy.visit('/product/123');
    });

    it('displays correct product title', () => {});
    it('has an Add to Cart button', () => {});
  });

  context('Cart', () => {
    beforeEach(() => {
      cy.visit('/cart');
    });

    it('shows added products', () => {});
  });
});
```

* Hooks in **outer `describe` blocks** apply to inner blocks unless overridden.
* Nested hooks run **from outermost to innermost** before the test, and **in reverse** after the test.

---

## ✅ Best Practices with Cypress + Mocha

1. **Keep Tests Isolated**

   * Use `beforeEach` to reset app state via `cy.visit()` or custom login commands.

2. **Group Related Tests**

   * Use `describe` or `context` to cluster test suites logically.

3. **Avoid Overusing `before`**

   * It runs **once**, so errors inside it can halt the suite.

4. **Use `beforeEach` for Reproducibility**

   * Revisit pages, reset DB, or set state to avoid flaky tests.

5. **Readable Descriptions**

   * Describe blocks should state "what", and `it` blocks should describe "should do this".

```js
describe('Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show an error for wrong credentials', () => {});
  it('should redirect to dashboard on success', () => {});
});
```

---

## 🧪 `it`, `it.only`, `it.skip`

| Variant     | Behavior                                |
| ----------- | --------------------------------------- |
| `it()`      | Normal test run                         |
| `it.only()` | Runs **only** that test (for debugging) |
| `it.skip()` | Skips this test                         |

Same applies to `describe.only()` and `describe.skip()`.

---

## Summary Table

| Function     | Purpose                      |
| ------------ | ---------------------------- |
| `describe`   | Group tests                  |
| `context`    | Alias of `describe`          |
| `it`         | Define a test case           |
| `before`     | Setup logic before all tests |
| `after`      | Cleanup after all tests      |
| `beforeEach` | Setup before each test       |
| `afterEach`  | Cleanup after each test      |
| `.only()`    | Run exclusively              |
| `.skip()`    | Skip the test/block          |
