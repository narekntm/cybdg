# 🧪 User Management – Cypress Sandbox

---

## 📋 Features

### 🔐 Admin Login

- Email/password login with validation
- Credentials: `admin@example.com` / `admin123`
- Admin controls are shown/hidden based on login status
- Admin privilege is required to delete Admin users

### 👤 User Form

- **Inputs:** Full Name, Role, Age, Email, Gender, Subscriptions
- **Validation Rules:**
  - Name: 1–20 alphabetic characters, required
  - Role: required
  - Age: 1–99, required
  - Email: valid format, required
  - Gender: required
- Subscriptions are optional (checkboxes)
- Add or Edit users dynamically

### 📑 User Table

- Displays added users (plus default users on load)
- Table columns:
  - Name, Role, Age, Email, Gender, Subscription, Status, Actions
- Actions:
  - **Edit**: load data into form
  - **Delete**: confirmation modal
  - **Status Toggle**: Active ↔ Inactive

### ⚠️ Modals & Alerts

- Modal confirmation before user deletion
- Inline errors for validation and admin restrictions

---

## ✅ Test Cases

### 🔐 Admin Login

| Test Case                                           |
| --------------------------------------------------- |
| Login with valid credentials                        |
| Login with invalid credentials                      |
| Admin delete become active after login              |
| Admin delete errors out after logout / before login |

---

### 👤 Add New User

| Test Case                              |
| -------------------------------------- |
| Add user with valid input              |
| Submit form with all fields empty      |
| Invalid name (e.g. symbols, numbers)   |
| Invalid email format                   |
| No gender selected                     |
| Submit without selecting subscriptions |

---

### ✏️ Edit Existing User

| Test Case                                  |
| ------------------------------------------ |
| Clicking "Edit" loads user data into form  |
| Submitting updated form replaces table row |

---

### 🗑 Delete User

| Test Case                                       |
| ----------------------------------------------- |
| Clicking "Delete" opens confirmation modal      |
| Clicking "Yes" deletes the selected user        |
| Clicking "Cancel" closes modal, no action taken |
| Non-admin tries to delete Admin user            |
| Admin user deletes another Admin after login    |

---

### 🔁 Toggle Status

| Test Case                              |
| -------------------------------------- |
| Status toggles between Active/Inactive |

---

## 🔍 Edge Case Scenarios

- Submit with minimum (1) and maximum (99) age values
- Submit form with leading/trailing spaces
- Refresh page and ensure default users are shown
