# QuizManager API Tests

This document describes the API test coverage for the `QuizManager` system.

---

## Auth.ts

### ✅ Positive Cases

* **Login as Admin** and access `/auth/me`
* **Login as User** and access `/auth/me`
* **Logout** and confirm access to `/auth/me` is blocked
* **Admin can access** `/api/users` and see all non-admin users

### ❌ Negative Cases

* Invalid email → `401 Invalid credentials`
* Wrong password → `401 Invalid credentials`
* Access `/auth/me` without login → `401 Unauthorized`
* User access to `/api/users` → `403 Forbidden`
* Invalid `authToken` cookie → `401 Unauthorized`
* Unauthenticated access to protected endpoints (quizzes, users, submissions) → `401 Unauthorized`

---

## QuizAssignment.ts

### 🔹 Assignment Logic

* `assignedUsers = 'all'` → all users see the quiz
* `assignedUsers = [email1]` → only specified users see the quiz
* Unassigned users do **not** see quiz

### ⚡️ Edge Cases

* `assignedUsers = []` → quiz not visible to anyone
* `status != active` → quiz not visible, even if assigned
* Admin sees **all created quizzes**, regardless of assignment or status

---

## QuizCreation.ts

### ✅ Positive Cases

* Admin can create quiz
* Quiz includes all question types (input, radio, checkbox, dropdown)
* Created quiz appears in `/api/quizzes`
* Admin can **publish** quiz (→ `active`)
* Admin can **archive** quiz (→ `archived`)

### ❌ Negative Cases

* User cannot:

  * Create quiz → `403`
  * Publish quiz → `403`
  * Archive quiz → `403`
  * Delete quiz → `403`
* Publishing or archiving non-existent quiz → `404 Quiz not found`
* Deleting quiz with submissions → `400 Quiz has submissions`

---

## Submissions.ts

### 📉 Submit

* ✅ User can submit quiz
* ❌ Re-submitting same quiz → `409 Already submitted`
* ❌ Submitting to non-existent quiz → `404 Quiz not found`

### ✍️ Edit

* ✅ User can edit own submission if quiz is still `active`
* ❌ Editing after quiz archived → `400 Quiz is not editable`
* ❌ Editing someone else's submission → `403 Forbidden`

### 📃 Access

* ✅ `/submissions/me` → user sees their own submissions
* ✅ `/quizzes/:id/submissions` → admin sees all quiz submissions
* ✅ `/submissions/:id` →

  * Admin can view any submission
  * User can view **only their own**
* ❌ User trying to access another user's submission → `403 Forbidden`

---

## Validations.ts

### ⚠️ All scenarios are expected to return `400 Bad Request`. Success (`200`) is a **BUG**.

### Quiz Creation Validation

* ❌ Quiz with **no questions** → should fail
* ❌ `radio`, `checkbox`, `dropdown` with empty `options[]` → should fail
* ❌ Invalid question structure:

  * Missing `label`
  * Invalid `type`
  * Missing `options[]`

### Submission Validation

* ❌ Submitting with `answers: []` → should fail
* ❌ Missing `questionId` or `answer` → should fail
* ❌ Invalid `answer` type (e.g., number) → should fail

---

## Summary

| Functional Area  | Positive Cases | Negative Cases | Edge/Validation |
| ---------------- | -------------- | -------------- | --------------- |
| Auth             | ✅ Yes          | ✅ Yes          | -               |
| Quiz Creation    | ✅ Yes          | ✅ Yes          | ✅ Yes           |
| Assignment Rules | ✅ Yes          | ✅ Yes          | ✅ Yes           |
| Submissions      | ✅ Yes          | ✅ Yes          | ✅ Yes           |
| Validation Rules | -              | ✅ Yes          | ✅ Yes           |

