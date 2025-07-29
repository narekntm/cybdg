Here's a structured outline you can present for your **final lecture wrap-up session**. It summarizes all your points clearly and reinforces clean code practices, test hygiene, and practical Cypress advice:

---

## ✅ Final Tips & Code Standards Wrap-up

### 📦 Storing Values

- ❌ `cy.wrap(response.body.id).as("quizId")`
  This makes accessing values harder and async-dependent.
- ✅ Instead:
  Declare a `let quizId` in higher scope and assign directly:

  ```ts
  let quizId;
  cy.request(...).then(res => {
    quizId = res.body.id;
  });
  ```

---

### 🔄 Loops & Conditions

- `forEach()` won't run on empty arrays.
  `[1,2,3] → 3 loops`, `[] → 0 loops`
  ☝️ Useful when testing dynamic behavior.

---

### 🧱 Interface Structure

- ❌ Avoid nested inline types:

  ```ts
  answers: { [questionId: string]: string | string[] }
  ```

- ✅ Extract them:

  ```ts
  export interface Submission {
    id: string;
    answers: Answers;
    createdAt: string;
  }

  export interface Answers {
    [questionId: string]: string | string[];
  }
  ```

---

### 🧼 Code Hygiene

- ❌ Never commit unused variables, imports, or code blocks.
- ✅ Variable/class/function names should be **descriptive and typo-free**.
- ❌ Don't write empty test hooks like `before(() => {})`.
- ❌ Avoid bloated files:
  🔁 Split test files that grow beyond **\~100 lines**.

---

### 🧵 Template Literals

- ❌ `"Hello " + name`
- ✅ Use backticks instead: `` `Hello ${name}` ``
  Cleaner and easier to read/maintain.

## 📌 Cypress.Promise Example

### 🔁 `.then()` Usage

- ❌ If you have: `.then(() => {})` → **Don't use `.then` at all.**
  It's unnecessary and adds async complexity. If test doesn't work without it, then is not working correctly.
- ✅ If you have: `.then(res => { ... })` → **Valid use case.**
  You're working with response data or chained logic.

---

Use `Cypress.Promise` to bridge Cypress commands inside async utility functions:

### ✅ Example: Fetch Specific User Details

```ts
function getSpecificUserDetails() {
  return new Cypress.Promise((resolve, reject) => {
    cy.request({
      method: "GET",
      url: "/api/users",
    }).then((resp) => {
      expect(resp.status).to.eq(200);

      cy.request({
        method: "GET",
        url: `/api/user/${resp.body[0].id}`,
      }).then((resp) => {
        expect(resp.status).to.eq(200);
        if (!resp.body) {
          reject(new Error("User details not found"));
        }
        resolve(resp.body);
      });
    });
  });
}
```

**Why this is useful:**

- You can now `getSpecificUserDetails().then((resp) => {...})` inside Cypress.
- Keeps nested Cypress commands inside a resolved promise for better composability.

---

## 🪝 `.then()` Chaining – Don't Nest, Don't Repeat

Avoid repeating chained `.then()` calls with the **same structure**. Keep indentation flat for better readability.

### ❌ Messy version (double-indented & inconsistent):

```ts
TestUserBuilder.createUser(UserRole.Manager)
  .then((m) => (manager = m))
  .then(() => TestUserBuilder.createUser(UserRole.User))
  .then((u1) => (user1 = u1))
  .then(() => TestUserBuilder.createUser(UserRole.User))
  .then((u2) => (user2 = u2));
```

### ✅ Cleaned-up version:

```ts
TestUserBuilder.createUser(UserRole.Manager).then((m) => (manager = m));
TestUserBuilder.createUser(UserRole.User).then((u1) => (user1 = u1));
TestUserBuilder.createUser(UserRole.User).then((u2) => (user2 = u2));
```

**Tip:**
If you find yourself writing more than 3 chained `.then()`s, consider updating the function structure to clean things up.
