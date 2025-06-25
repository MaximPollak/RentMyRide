const API_BASE = 'http://localhost:3000'; // Base URL for backend API

// User login: sends credentials, receives token and user info
export async function loginUser(credentials) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('user', JSON.stringify(data.user)); // Save user locally
    return data;
}

// User logout: clears session by calling logout endpoint
export async function logoutUser() {
    const res = await fetch(`${API_BASE}/logout`, {
        method: 'GET',
        credentials: 'include'
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Logout failed');
    return result;
}

// User registration: creates new user account
export async function registerUser(data) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
}

// Get current authenticated user from the server
export const getCurrentUser = async () => {
    const res = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        credentials: 'include'
    });

    if (res.status === 401) throw new Error('Not authenticated');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
};

// Update a user's profile by ID
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

// Get list of cars marked as available
export const getAvailableCars = async () => {
    const res = await fetch(`${API_BASE}/cars/available`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch available cars');
    return res.json();
};

// Get all cars from the backend
export async function getAllCars() {
    const res = await fetch(`${API_BASE}/cars`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch cars');
    return res.json();
}

// Get a single car by its ID
export const getCarById = async (id) => {
    const res = await fetch(`${API_BASE}/cars/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch car details');
    return res.json();
};

// Refresh availability of all cars based on expired bookings
export const refreshCarAvailability = async () => {
    const res = await fetch(`${API_BASE}/cars/refresh-availability`, {
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to refresh availability');
    return res.json();
};

// Get bookings for the currently logged-in user
export const getUserBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings/mybookings`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
};

// Create a new booking (requires authentication)
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

// Admin: Get all users
export const getAllUsers = async () => {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

// Admin: Get all bookings across all users
export const getAllBookings = async () => {
    const res = await fetch(`${API_BASE}/bookings/admin`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
};

// Admin: Add a new car with image file upload
export const addCar = async (carData, imageFile) => {
    const formData = new FormData();
    for (const key in carData) {
        formData.append(key, carData[key]);
    }
    formData.append('image', imageFile); // Attach image as file

    const res = await fetch(`${API_BASE}/cars/addCar`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    if (!res.ok) throw new Error('Failed to add car');
    return res.json();
};

// Admin: Update an existing car by ID, optionally with new image
export const updateCar = async (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach(key => {
        if (carData[key] !== undefined) {
            formData.append(key, carData[key]);
        }
    });

    const res = await fetch(`${API_BASE}/cars/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
    });

    if (!res.ok) throw new Error('Failed to update car');
    return res.json();
};

// Admin: Delete a user by ID
export const deleteUser = async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
};