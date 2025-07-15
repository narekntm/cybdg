# ✅ Quiz Manager – Test Case Suite

This document outlines the core **functional test cases** for the Quiz Manager application. The system includes authentication, role-based pages, quiz management (CRUD), quiz taking, submission review, and test-only API endpoints for automation setup.

---

## 🔐 Authentication

| ID        | Name                   | Description |
|-----------|------------------------|-------------|
| AUTH01    | Login Success          | Login with valid credentials redirects based on user role. |
| AUTH02    | Login Failure          | Invalid login shows error toast and stays on login page. |
| AUTH03    | Auto Redirect Logged-In | Already-authenticated user is redirected away from login. |
| AUTH04    | Logout Success         | Logging out clears session and redirects to login. |
| AUTH05    | Unauthorized Access    | Navigating to protected pages unauthenticated redirects to login. |

---

## 🧑‍🏫 Manager – Quiz Management

| ID        | Name                        | Description |
|-----------|-----------------------------|-------------|
| QUIZ01    | Create Quiz (Valid)         | Manager creates a valid quiz with required fields. |
| QUIZ02    | Create Quiz (Missing Fields)| Creating quiz without title/description/questions shows validation toasts. |
| QUIZ03    | Add Question With Options   | Radio/Checkbox/Dropdown types require at least one option. |
| QUIZ04    | Assignment Custom Users     | “Custom” mode requires at least one selected user. |
| QUIZ05    | Publish Quiz                | Changes quiz status to `active`. |
| QUIZ06    | Archive Quiz                | Changes quiz status to `archived`. |
| QUIZ07    | Delete Quiz (No Submissions)| Allows deletion if quiz has no submissions. |
| QUIZ08    | Delete Quiz (With Submissions)| Prevents deletion and shows error if submissions exist. |

---

## 🧑‍🎓 User – Quiz Taking

| ID        | Name                        | Description |
|-----------|-----------------------------|-------------|
| VIEW01    | Render Quiz Form            | Form renders all questions with proper controls. |
| VIEW02    | Submit New Answers          | User submits a new quiz response successfully. |
| VIEW03    | Edit Existing Submission    | User updates existing submission if quiz is active. |
| VIEW04    | View Archived Submission    | Submit button hidden for archived quizzes or inactive states. |

---

## 🧾 User Dashboard

| ID        | Name                        | Description |
|-----------|-----------------------------|-------------|
| USER01    | User Dashboard Loads Quizzes| Shows active quizzes based on assignment. |
| USER02    | User Dashboard Loads Submissions| Displays sorted list of user’s submissions. |
| USER03    | Quiz Not Found              | Opening invalid quiz shows a toast error. |

---

## 📊 Submission Review (Manager)

| ID        | Name                        | Description |
|-----------|-----------------------------|-------------|
| ADMIN01   | View Quiz Submissions       | Displays all submissions for selected quiz. |
| ADMIN02   | Submission Collapse/Expand  | Toggle answer section visibility per submission. |
| ADMIN03   | Missing Quiz ID in URL      | Displays error message if URL lacks `quiz` param. |

---

## 🧪 Test Utilities API

| ID        | Name                                | Description |
|-----------|-------------------------------------|-------------|
| TEST01    | Test Auth – Valid Credentials       | Returns a valid token when correct email/password is sent. |
| TEST02    | Test Auth – Invalid Credentials     | Returns 401 when wrong credentials are provided. |
| TEST03    | Create Test User – Valid Payload    | Adds a new test user with valid token and valid role. |
| TEST04    | Create Test User – Missing Fields   | Returns 400 if any required field (id, email, password, role) is missing. |
| TEST05    | Create Test User – Invalid Role     | Returns 400 if role is not `user` or `manager`. |
| TEST06    | Create Test User – Duplicate ID/Email | Returns 409 if user with same ID or email already exists. |
| TEST07    | Test Auth Header Missing            | Returns 401 if `Authorization` header is not provided. |
| TEST08    | Test Auth Token Invalid             | Returns 403 if token is invalid or expired. |

---

## 🔔 Toast Notifications

| ID        | Name                        | Description |
|-----------|-----------------------------|-------------|
| TOAST01   | Toast Render Success        | Displays success toast for success messages. |
| TOAST02   | Toast Render Error          | Displays error toast for failures. |
| TOAST03   | Toast Accepts Array         | Multi-line toast works for array of strings. |

---