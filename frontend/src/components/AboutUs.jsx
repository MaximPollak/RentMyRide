import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function AboutUs() {
    return (
        <motion.div
            className="about-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />
            <motion.main
                className="about-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
                <motion.div className="about-card">
                    <h3>Why Choose Us?</h3>
                    <p>
                        We believe car rental should be smooth, flexible, and completely transparent. That’s why we offer competitive pricing,
                        clear terms, and a simple booking process — no confusing fine print, no last-minute surprises. Just quality service from start to finish.
                    </p>
                </motion.div>
                <motion.div className="about-card">
                    <h3>A Fleet You Can Trust</h3>
                    <p>
                        Whether you’re heading out on a weekend trip or need a reliable ride for the week, our cars are regularly maintained,
                        fully insured, and kept in top condition. From everyday models to stylish upgrades, RentMyRide gives you the keys to quality and comfort.
                    </p>
                </motion.div>
                <motion.div className="about-card">
                    <h3>Fast & Flexible Booking</h3>
                    <p>
                        Life moves fast — and so do we. With RentMyRide, you can book a car in just a few clicks, choose pickup and return times that
                        suit your schedule, and cancel or adjust your booking easily if plans change. Renting a car has never been this convenient.
                    </p>
                </motion.div>
            </motion.main>
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </motion.div>
    );
}