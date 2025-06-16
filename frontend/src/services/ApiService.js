const API_BASE = 'http://localhost:3000' // adjust to your backend URL

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

// ✅ Fetch user details
export const getCurrentUser = async () => {
    const res = await fetch('http://localhost:3000/users/me', {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
};

// ✅ Fetch user's bookings
export const getUserBookings = async () => {
    const res = await fetch('http://localhost:3000/bookings/mybookings', {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
};

export async function getAllCars() {
    const res = await fetch(`${API_BASE}/cars`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // only if needed for cookies/JWT
    });

    if (!res.ok) throw new Error('Failed to fetch cars');
    return res.json();
}