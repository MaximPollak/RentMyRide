import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css' //global styling
import Homepage from "./components/Homepage";
import Register from "./components/Register";

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={< Homepage /> } />
            <Route path="/register" element={< Register />} />
        </Routes>
    </Router>
    )
}

export default App;