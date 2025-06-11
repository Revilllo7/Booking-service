function getToken(): string | null {
  return localStorage.getItem('keycloak-token');
}

// legacy code from before Keycloak integration
// export async function login(username: string, password: string) {
//   const res = await fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password }),
//   });
//   if (!res.ok) throw new Error('Login failed');
//   return res.json();
// }

// export async function register(username: string, password: string, role: string) {
//   const res = await fetch('/api/auth/register', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password, role }),
//   });
//   if (!res.ok) throw new Error('Register failed');
//   return res.json();
// }

export async function getBooking(id: number) {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const res = await fetch(`/api/bookings/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export async function updateBooking(id: number, data: any) {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function deleteBooking(id: number) {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}