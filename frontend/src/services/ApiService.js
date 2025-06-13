const API_BASE = 'http://localhost:3000/' // adjust to your backend URL

export const getAllCars = async () => {
    const res = await fetch(`${API_BASE}/cars`)
    if (!res.ok) throw new Error('Failed to fetch cars')
    return res.json()
}

export async function registerUser(data) {
    const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log('📦 Response from backend:', result); // ✅ LOG HERE

    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
}

export async function loginUser(credentials) {
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Login failed');

    // Save user info in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
}

export async function logoutUser() {
    const res = await fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include'
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Logout failed');
    return result;
}