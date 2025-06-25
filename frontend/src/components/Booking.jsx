import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getAvailableCars, createBooking } from '../services/apiService';
import { motion as _motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';
import { useSearchParams } from 'react-router-dom';

// Register German locale for the datepicker
registerLocale('de', de);

export default function BookingPage() {
    // State to hold list of available cars
    const [cars, setCars] = useState([]);

    // Booking form state
    const [form, setForm] = useState({ car_id: '', start_date: null, end_date: null });

    const [loading, setLoading] = useState(true);

    // Get query params like ?car_id=2 from URL
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Fetch available cars from the backend on initial load
        async function fetchCars() {
            try {
                const available = await getAvailableCars();
                setCars(available);

                // Pre-fill selected car if passed in query params
                const selectedId = searchParams.get('car_id');
                if (selectedId && available.some(c => c.car_id == selectedId)) {
                    setForm(prev => ({ ...prev, car_id: selectedId }));
                }
            } catch (err) {
                toast.error('Failed to load available cars');
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [searchParams]);

    // Handles change of date inputs (start and end)
    const handleDateChange = (date, name) => {
        setForm(prev => ({ ...prev, [name]: date }));
    };

    // Handles change of select input (car selection)
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handles form submission to create a booking
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.start_date || !form.end_date) {
            return toast.error('Please select both start and end dates');
        }

        try {
            // Format dates for backend compatibility
            const formattedForm = {
                ...form,
                start_date: format(form.start_date, 'yyyy-MM-dd'),
                end_date: format(form.end_date, 'yyyy-MM-dd')
            };

            await createBooking(formattedForm);

            toast.success('Booking created successfully');
            setForm({ car_id: '', start_date: null, end_date: null }); // Reset form
        } catch (err) {
            toast.error(err.message || 'Booking failed');
        }
    };

    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />
            <h2 className="cars-title">Book a Car</h2>

            <div className="auth-container bookingpage-auth-container">
                {loading ? (
                    <p>Loading available cars...</p>
                ) : (
                    <form className="auth-form booking-form" onSubmit={handleSubmit}>
                        <label>Select Car</label>
                        <select name="car_id" value={form.car_id} onChange={handleChange} required>
                            <option value="" disabled>-- Choose a car --</option>
                            {cars.map(car => (
                                <option key={car.car_id} value={car.car_id}>
                                    {car.brand} {car.model} • {car.category} • €{car.price_per_day}/day
                                </option>
                            ))}
                        </select>

                        <label>Start Date</label>
                        <div className="dark-datepicker">
                            <DatePicker
                                selected={form.start_date}
                                onChange={(date) => handleDateChange(date, 'start_date')}
                                dateFormat="dd.MM.yyyy"
                                locale="de"
                                placeholderText="Select start date"
                                required
                            />
                        </div>

                        <label>End Date</label>
                        <div className="dark-datepicker">
                            <DatePicker
                                selected={form.end_date}
                                onChange={(date) => handleDateChange(date, 'end_date')}
                                dateFormat="dd.MM.yyyy"
                                locale="de"
                                placeholderText="Select end date"
                                className="datepicker-input"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button">Book</button>
                    </form>
                )}
            </div>

            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}