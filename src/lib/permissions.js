export function canAdjustStock(user) {
  return user?.role === 'admin' || user?.role === 'gérant'
}
