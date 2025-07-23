# ✅ Quiz Manager – Test Coverage

This document outlines all automated test cases for the Quiz Manager system, split by API, UI, and E2E levels.

---

## ✅ API Test Cases

**Test Files:**

* `Auth.ts`
* `QuizCreation.ts`
* `QuizAssignment.ts`
* `Submissions.ts`

### 🔐 Auth API

* ✅ Login as manager/user (`POST /api/login`)
* ✅ Logout, clear session (`POST /api/logout`)
* ✅ Auth check (`GET /api/auth/me`)
* ✅ Manager-only access to `/api/users`
* ✅ Deny access if:

  * Email/password invalid
  * Token missing/invalid
  * User accessing manager endpoints
  * Token syntactically valid but not in session

### 📚 Quiz Creation

* ✅ Create quiz as manager (`POST /api/quizzes`)
* ✅ Supports all question types (input, radio, checkbox, dropdown)
* ✅ Default status: `draft`, `assignedUsers: ['all']`
* ✅ Publish → `PATCH /api/quizzes/:id/publish` → `active`
* ✅ Archive → `PATCH /api/quizzes/:id/archive` → `archived`
* ✅ Prevent actions by regular users
* ✅ Prevent publishing/archive of non-existent quiz (404)
* ✅ Prevent deleting quizzes with submissions (400)

### 👥 Quiz Assignment

* ✅ Quizzes with `assignedUsers: 'all'` visible to all
* ✅ Quizzes with targeted users visible only to them
* ✅ Empty `assignedUsers: []` → not visible
* ✅ Draft/inactive quizzes not visible
* ✅ Managers see all of their created quizzes

### 📝 Submissions

* ✅ Submit quiz (`POST /api/quizzes/:id/submissions`)
* ✅ Prevent duplicate submission (409)
* ✅ Edit submission (`PUT /api/submissions/:id`)
* ✅ Block edit after archive (400)
* ✅ Prevent editing/viewing others' submission (403)
* ✅ Get own submissions (`GET /api/submissions/me`)
* ✅ Manager sees all quiz submissions (`GET /api/quizzes/:id/submissions`)
* ✅ View individual submission (`GET /api/submissions/:id`)

---

## ✅ UI Test Cases

**Test Files:**

* `Login.ts`
* `ManagerDashboard.ts`
* `User.ts`
* `QuizView.ts`
* `ViewSubmissions.ts`

### 🔑 Login Flow

* ✅ Login redirects (manager → manager.html, user → user.html)
* ✅ Error shown on invalid credentials
* ✅ Auto-redirect if already logged in
* ✅ Logout + restrict access to protected pages

### 📋 Manager Dashboard

* ✅ Create quiz through form (4 types)
* ✅ Assign to "all" and "custom"
* ✅ Validations for empty fields, options, assignment
* ✅ Publish, archive, delete quizzes
* ✅ Prevent deletion with submissions (error toast)
* ✅ Quiz list UI: title, description, status, actions

### 👤 User View Page

* ✅ Header shows username (user ID)
* ✅ List of available quizzes
* ✅ Submission list with dates
* ✅ Button: Edit if active, View if archived
* ✅ “Submit” navigates to quiz view page
* ✅ Messages for: no quizzes, no submissions
* ✅ Toast on error fetching quizzes

### 📄 Quiz View Page

* ✅ Render quiz title and description
* ✅ Show all question types
* ✅ Pre-fill answers when editing
* ✅ Hide submit for archived quiz
* ✅ Submit new or edit existing quiz
* ✅ Redirect after success

### 📊 View Submissions Page

* ✅ Quiz info: title, description
* ✅ Submission list: user ID + timestamp
* ✅ Show answers per question
* ✅ Expand/collapse all answers
* ✅ Invalid quiz ID → error message
* ✅ Prevent non-managers from accessing

---

## ✅ E2E Test Cases

**Test Files:**

* `E2E/Auth.ts`
* `E2E/ManagerDashboard.ts`
* `E2E/User.ts`

### 🔐 E2E Authentication & Session

* ✅ Login as manager/user, redirect, dashboard visible
* ✅ Invalid login shows correct error
* ✅ Already logged-in user is redirected
* ✅ Logout clears session and restricts access
* ✅ Invalid token → redirects to login

### 🧩 E2E Manager Dashboard

* ✅ Sees only own created quizzes
* ✅ Create quiz with 4 types
* ✅ UI validation for title/desc/questions/options
* ✅ Create quizzes with assignedUsers = all/custom
* ✅ Verifies saved payload matches UI
* ✅ Verifies UI quiz listing after creation

### 🧪 E2E Full Flow (Manager → User → Manager)

* ✅ Manager creates and assigns quiz to specific user
* ✅ User logs in, submits quiz
* ✅ Manager views submissions, validates answer content
* ✅ Assertions on IDs, response body, and rendered data

---

> For running tests, use:

```bash
npm run test:runArthur          # All tests
npm run test:runArthur:api      # API tests
npm run test:runArthur:ui       # UI tests
npm run test:runArthur:e2e      # E2E tests
```

---
