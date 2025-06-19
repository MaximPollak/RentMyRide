import React, { useState } from 'react';
import { updateCar } from '../services/apiService';
import { toast } from 'react-toastify';

export default function EditCarForm({ car, onClose, onSuccess }) {
    const [form, setForm] = useState({
        brand: car.brand,
        model: car.model,
        category: car.category,
        price_per_day: car.price_per_day,
        info: car.info || '',
        available: car.available
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { ...form };
        if (imageFile) formData.image = imageFile;

        try {
            await updateCar(car.car_id, formData);
            toast.success('Car updated successfully');
            onSuccess(); // Refresh or navigate
        } catch (err) {
            console.error('Error updating car:', err);
        }
    };

    return (
        <div className="edit-car-modal">
            <form onSubmit={handleSubmit} className="edit-car-form">
                <h3>Edit Car</h3>

                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} required />

                <label>Model</label>
                <input name="model" value={form.model} onChange={handleChange} required />

                <label>Category</label>
                <input name="category" value={form.category} onChange={handleChange} required />

                <label>Price per day</label>
                <input name="price_per_day" type="number" value={form.price_per_day} onChange={handleChange} required />

                <label>Info</label>
                <textarea name="info" value={form.info} onChange={handleChange} />

                <label>Status</label>
                <select name="available" value={form.available} onChange={handleChange}>
                    <option value={1}>Available</option>
                    <option value={0}>Booked</option>
                </select>

                <label>Change Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Cancel</button>
            </form>
        </div>
    );
}