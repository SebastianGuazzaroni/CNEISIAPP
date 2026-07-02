export function getHomeRoute(role) {
  const normalized = String(role || 'participant').toLowerCase();
  if (normalized === 'superadmin') return '/management';
  if (normalized === 'admin') return '/scanner';
  return '/participant';
}
