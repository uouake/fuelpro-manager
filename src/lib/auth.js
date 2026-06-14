export function authenticatePin(users, role, pin) {
  return users.find((user) => (user.pin ?? user.pin_hash) === pin && user.role === role) ?? null;
}
