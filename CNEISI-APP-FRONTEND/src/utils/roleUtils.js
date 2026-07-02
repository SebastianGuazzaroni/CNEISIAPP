export function normalizeRole(value) {
  const role = String(value || 'participant').trim().toLowerCase()
  if (role === 'superadmin') return 'superadmin'
  if (role === 'admin') return 'admin'
  return 'participant'
}
