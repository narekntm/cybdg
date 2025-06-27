import { getUsersList, setUsersList, resetUserData } from "../data/users.js";
import { validateUserPayload } from "../utils/validation.js";
import { getNextId } from "../utils/idGenerator.js";
import { VALIDATION_ERRORS } from "../utils/constants.js";

// 📋 GET all users
export function getUsers(req, res) {
  res.json(getUsersList());
}

// 📋 GET user
export function getUserById(req, res) {
  const id = +req.params.id;
  const users = getUsersList();
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });
  }

  res.json(user);
}

// ➕ POST new user
export function addUser(req, res) {
  const user = { ...req.body, email: req.body.email?.toLowerCase().trim() };
  const errors = validateUserPayload(user);

  if (errors.length > 0) return res.status(400).json({ errors });

  const users = getUsersList();
  if (users.some(u => u.email === user.email))
    return res.status(409).json({ errors: [VALIDATION_ERRORS.duplicateEmail] });

  const newUser = { id: getNextId(users), ...user, status: "Active" };
  setUsersList([...users, newUser]);
  res.json(newUser);
}

// 🖊️ PUT update user
export function updateUser(req, res) {
  const id = +req.params.id;
  const user = { ...req.body, email: req.body.email?.toLowerCase().trim() };
  const errors = validateUserPayload(user);
  if (errors.length > 0) return res.status(400).json({ errors });

  const users = getUsersList();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  const duplicateEmail = users.some(u => u.email === user.email && u.id !== id);
  if (duplicateEmail) return res.status(409).json({ errors: [VALIDATION_ERRORS.duplicateEmail] });

  users[index] = { ...users[index], ...user };
  setUsersList(users);
  res.json(users[index]);
}

// ❌ DELETE user
export function deleteUser(req, res) {
  const id = +req.params.id;
  const { isAdmin } = req.body;

  const users = getUsersList();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  if (!isAdmin && users[index].role === "Admin") {
    return res.status(403).json({ errors: ["Admin login required to delete Admin user"] });
  }

  users.splice(index, 1);
  setUsersList(users);
  res.json({ success: true });
}

// 🔁 PATCH toggle status
export function toggleStatus(req, res) {
  const users = getUsersList();
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ errors: [VALIDATION_ERRORS.notFound] });

  user.status = req.body.status || user.status;
  setUsersList(users);
  res.json(user);
}

// ♻️ POST reset users
export function resetUsers(req, res) {
  resetUserData();
  res.json({ success: true, users: getUsersList() });
}

export function seedUsers(req, res) {
  const { users: incomingUsers, overwrite = false } = req.body;

  // 🚨 Validate request body
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ errors: ["Request body must be a valid JSON object."] });
  }

  if (!Array.isArray(incomingUsers)) {
    return res.status(400).json({ errors: ["Expected 'users' to be an array."] });
  }

  if (incomingUsers.length > 50) {
    return res.status(400).json({ errors: ["You can seed up to 50 users at once."] });
  }

  const currentUsers = getUsersList();
  let updatedUsers = [...currentUsers];
  const seededUsers = [];
  const skippedUsers = [];
  const validationErrors = [];

  incomingUsers.forEach((u, i) => {
    if (!u || typeof u !== "object") {
      validationErrors.push({ index: i, email: null, errors: ["Each user must be an object."] });
      return;
    }

    const user = {
      ...u,
      email: u.email?.toLowerCase().trim(),
      status: u.status || "Active",
    };

    const errors = validateUserPayload(user);
    if (errors.length > 0) {
      validationErrors.push({ index: i, email: user.email, errors });
      return;
    }

    const existingIndex = updatedUsers.findIndex((existing) => existing.email === user.email);

    if (existingIndex !== -1) {
      if (overwrite) {
        user.id = updatedUsers[existingIndex].id;
        updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], ...user };
        seededUsers.push(user);
      } else {
        skippedUsers.push(user.email);
      }
    } else {
      user.id = getNextId(updatedUsers);
      updatedUsers.push(user);
      seededUsers.push(user);
    }
  });

  setUsersList(updatedUsers);

  res.json({
    success: true,
    added: seededUsers.length,
    skipped: skippedUsers,
    failed: validationErrors,
  });
}

