import React from 'react';
import { Link } from 'react-router-dom';
import homepageCar from '../assets/bmwlogo.png'; // Static image shown on homepage
import Navbar from './Navbar';
import { motion as _motion } from 'framer-motion'; // Animation library

export default function Homepage() {
    return (
        <_motion.div
            className="homepage-container"
            initial={{ opacity: 0, scale: 0.96 }}  // Animation: fade in and scale up
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <Navbar />

            {/* Intro content section */}
            <main className="intro-section">
                {/* Text and buttons */}
                <_motion.div
                    className="intro-text"
                    initial={{ opacity: 0, y: 30 }} // Slide in from below
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                >
                    <h2 className="subtitle">The Best</h2>
                    <h1 className="title">Car Rental</h1>
                    <p className="tagline">It’s easier on wheels!</p>

                    {/* CTA button to booking page */}
                    <Link to="/booking" className="book-button">
                        Book a car
                    </Link>

                    {/* Registration prompt */}
                    <div className="register-info">
                        You don’t have an account yet?{' '}
                        <Link to="/register" className="register-link">
                            Register yourself
                        </Link>
                    </div>
                </_motion.div>

                {/* Right side image animation */}
                <_motion.div
                    className="intro-image"
                    initial={{ opacity: 0, x: 50 }} // Slide in from right
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                >
                    <img src={homepageCar} alt="Homepage car" />
                </_motion.div>
            </main>

            {/* Footer with credit */}
            <footer className="footer">
                all rights reserved: ©MaximPollák 2025
            </footer>
        </_motion.div>
    );
}