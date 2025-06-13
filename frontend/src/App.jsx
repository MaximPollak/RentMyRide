import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css' //global styling
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";
import AboutUs from "./components/AboutUs";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={< Homepage /> } />
            <Route path="/register" element={< Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />
    </Router>
    )
}

export default App;