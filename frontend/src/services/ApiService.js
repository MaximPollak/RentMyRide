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