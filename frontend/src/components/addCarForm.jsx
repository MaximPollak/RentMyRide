import React, { useState } from 'react';
import { addCar } from '../services/apiService';
import { toast } from 'react-toastify';

export default function AddCarForm({ onCarAdded }) {
    const [form, setForm] = useState({
        brand: '',
        model: '',
        category: '',
        price_per_day: '',
        info: '',
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return toast.error('Please upload a car image.');

        try {
            await addCar(form, image);
            toast.success('Car added successfully!');
            setForm({ brand: '', model: '', category: '', price_per_day: '', info: '' });
            setImage(null);
            onCarAdded();
        } catch (err) {
            toast.error('Failed to add car.');
            console.error(err);
        }
    };

    return (
        <form className="admin-car-form" onSubmit={handleSubmit}>
            <h4>Add New Car</h4>
            <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" required />
            <input type="text" name="model" value={form.model} onChange={handleChange} placeholder="Model" required />
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
            <input type="number" name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="Price per Day" required />
            <textarea name="info" value={form.info} onChange={handleChange} placeholder="Car info..." rows={4} />
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit">Add Car</button>
        </form>
    );
}