const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Connect to database
const db = require('./services/database.js');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // your frontend address
    credentials: true               // allows cookies to be sent
}));

app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ❗ Do NOT use express.json() before file-upload routes
// Load routers BEFORE express.json if they handle file uploads
const carRoutes = require('./routes/cars'); // has multer
app.use('/api/cars', carRoutes);

// Safe to use now
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other routers (that don’t do file uploads)
const indexRouter = require('./routes/index');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');

app.use('/api', indexRouter);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
//app.use('/uploads', express.static('public/uploads'));

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`);
});