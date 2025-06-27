export function getNextId(users) {
  return users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}
