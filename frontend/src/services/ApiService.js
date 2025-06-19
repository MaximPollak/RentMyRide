//const API_BASE = 'http://localhost:3000/api' // adjust to your backend URL
export const API_BASE = import.meta.env.VITE_API_BASE;

export async function loginUser(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
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
    const res = await fetch(`${API_BASE}/logout`, {
        method: 'GET',
        credentials: 'include'
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Logout failed');
    return result;
}

export async function registerUser(data) {
    const res = await fetch(`${API_BASE}/register`, {
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
    const res = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        credentials: 'include', // important for sending cookie
    });

    if (res.status === 401) {
        throw new Error('Not authenticated');
    }

    if (!res.ok) {
        throw new Error('Failed to fetch user');
    }

    return res.json(); // returns the user object from backend
};

export const updateUser = async (id, updatedData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
};

// 📦 Get all available cars
export const getAvailableCars = async () => {
    const res = await fetch(`${API_BASE}/cars/available`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch available cars');
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

// ✅ Fetch a car by its ID
export const getCarById = async (id) => {
    const res = await fetch(`${API_BASE}/cars/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch car details');
    return res.json();
};

export const refreshCarAvailability = async () => {
    const res = await fetch(`${API_BASE}/cars/refresh-availability`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to refresh availability');
    return res.json();
};

// ✅ Fetch user's bookings
export const getUserBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings/mybookings`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
};

// 🔐 Submit a booking
export const createBooking = async (data) => {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Booking failed');
    }
    return res.json();
};

/*------------------
ADMIN DASHBOARD-----
------------------*/
export const getAllUsers = async () => {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'GET',
        credentials: 'include', // includes cookies for authentication
    });

    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

export const getAllBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings/admin`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
};

// services/apiService.js
export const addCar = async (carData, imageFile) => {
    const formData = new FormData();
    for (const key in carData) {
        formData.append(key, carData[key]);
    }
    formData.append('image', imageFile); // 🔁 change image_url → image

    const res = await fetch(`${API_BASE}/cars/addCar`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    if (!res.ok) throw new Error('Failed to add car');
    return res.json();
};

export const updateCar = async (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach(key => {
        if (carData[key] !== undefined) formData.append(key, carData[key]);
    });

    const res = await fetch(`${API_BASE}/cars/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
    });

    if (!res.ok) throw new Error('Failed to update car');
    return res.json();
};

export const deleteUser = async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
};