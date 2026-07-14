const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchGates() {
  const res = await fetch(`${API_BASE_URL}/gates`);
  if (!res.ok) throw new Error('Failed to fetch gates');
  return res.json();
}

export async function fetchActiveIncidents() {
  const res = await fetch(`${API_BASE_URL}/incidents/active`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchDecisions() {
  const res = await fetch(`${API_BASE_URL}/decisions`);
  if (!res.ok) throw new Error('Failed to fetch decisions');
  return res.json();
}
