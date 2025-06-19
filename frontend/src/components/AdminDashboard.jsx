import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { motion as _motion } from 'framer-motion';
import {
    getAllCars,
    getAllBookings,
    getAllUsers,
    getCurrentUser
} from '../services/apiService';
import EditCarForm from './EditCarForm';
import { useNavigate } from 'react-router-dom';
import '../App.css';
export const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newCar, setNewCar] = useState({
        brand: '',
        model: '',
        category: '',
        price_per_day: '',
        info: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [editCar, setEditCar] = useState(null); // Holds the car being edited
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser()
            .then((data) => {
                setUser(data);
                if (data.role !== 'admin') {
                    alert('⛔ You are not authorized to access the admin panel.');
                    navigate('/');
                } else {
                    fetchData(activeTab);
                }
            })
            .catch(() => {
                alert('Authentication error');
                navigate('/login');
            })
            .finally(() => setLoading(false));
    }, [activeTab]);

    const fetchData = (tab) => {
        if (tab === 'users') getAllUsers().then(setUsers).catch(console.error);
        if (tab === 'cars') getAllCars().then(setCars).catch(console.error);
        if (tab === 'bookings') getAllBookings().then(setBookings).catch(console.error);
    };

    const handleFormChange = (e) => {
        setNewCar({ ...newCar, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        if (!imageFile) return alert('Please upload an image.');

        const formData = new FormData();
        for (const key in newCar) {
            formData.append(key, newCar[key]);
        }
        formData.append('image', imageFile);

        try {
            const res = await fetch(`${API_BASE}/cars/addCar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token || ''}`
                },
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to add car');
            const created = await res.json();
            setCars((prev) => [...prev, created]);
            setNewCar({ brand: '', model: '', category: '', price_per_day: '', info: '' });
            setImageFile(null);
            alert('🚗 Car added successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to add car');
        }
    };

    if (loading) return <p>Loading admin panel...</p>;

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className="admin-container">
                <h2 className="admin-title">Admin Dashboard</h2>

                <div className="admin-tabs">
                    <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Users</button>
                    <button onClick={() => setActiveTab('cars')} className={activeTab === 'cars' ? 'active' : ''}>Cars</button>
                    <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>Bookings</button>
                </div>

                <div className="admin-section">
                    {activeTab === 'users' && (
                        <div className="admin-users">
                            <h3>Manage Users</h3>
                            {users.map(user => (
                                <div key={user.user_id} className="admin-user-card">
                                    <p><strong>{user.username}</strong> ({user.email}) - {user.role}</p>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'cars' && (
                        <div className="admin-cars">
                            <h3>Manage Cars</h3>
                            {cars.map(car => (
                                <div key={car.car_id} className="admin-car-card">
                                    <p><strong>{car.brand} {car.model}</strong> - {car.category} - €{car.price_per_day}</p>
                                    <button onClick={() => setEditCar(car)}>Edit</button>
                                    <button>Delete</button>
                                </div>
                            ))}

                            {editCar && (
                                <EditCarForm
                                    car={editCar}
                                    onClose={() => setEditCar(null)}
                                    onSave={(updatedCar) => {
                                        setCars(prev =>
                                            prev.map(c => (c.car_id === updatedCar.car_id ? updatedCar : c))
                                        );
                                        setEditCar(null);
                                    }}
                                />
                            )}

                            <form className="add-car-form" onSubmit={handleAddCar}>
                                <h3>Add a New Car</h3>

                                <label>Brand</label>
                                <input type="text" name="brand" value={newCar.brand} onChange={handleFormChange} required />

                                <label>Model</label>
                                <input type="text" name="model" value={newCar.model} onChange={handleFormChange} required />

                                <label>Category</label>
                                <input type="text" name="category" value={newCar.category} onChange={handleFormChange} required />

                                <label>Price per day (€)</label>
                                <input type="number" name="price_per_day" value={newCar.price_per_day} onChange={handleFormChange} required />

                                <label>Info</label>
                                <textarea name="info" value={newCar.info} onChange={handleFormChange} />

                                <label>Image</label>
                                <input type="file" name="image" onChange={handleImageChange} accept="image/*" required />

                                <button type="submit">Add Car</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="admin-bookings">
                            <h3>Manage Bookings</h3>
                            {bookings.map(b => (
                                <div key={b.booking_id} className="admin-booking-card">
                                    <p>
                                        <strong>{b.brand} {b.model}</strong> |{" "}
                                        {new Date(b.start_date).toLocaleDateString('de-DE')} →{" "}
                                        {new Date(b.end_date).toLocaleDateString('de-DE')}
                                    </p>
                                    <p>User: {b.username} | €{b.total_price}</p>
                                    <button>Update</button>
                                    <button>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <footer className="footer">all rights reserved: ©MaximPollák 2025</footer>
        </_motion.div>
    );
}