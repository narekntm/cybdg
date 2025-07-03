export const INITIAL_USERS = [
  { id: 1, name: "Alice", role: "Admin", age: 30, email: "alice@site.com", gender: "Female", subscriptions: "Newsletter", status: "Active" },
  { id: 2, name: "Bob", role: "Viewer", age: 25, email: "bob@site.com", gender: "Male", subscriptions: "Product Updates", status: "Inactive" },
  { id: 3, name: "Eve", role: "Editor", age: 28, email: "eve@site.com", gender: "Other", subscriptions: "Newsletter, Product Updates", status: "Active" },
];

let users = INITIAL_USERS.map(u => ({ ...u }));

export function getUsersList() {
  return users;
}

export function setUsersList(newList) {
  users = newList;
}

export function resetUserData() {
  users = INITIAL_USERS.map(u => ({ ...u }));
}
