export function generateUserId() {
  return "u_" + Math.random().toString(36).slice(2, 10);
}
