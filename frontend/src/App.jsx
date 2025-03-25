import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import SetCredentials from "./pages/SetCredentials";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

function App() 
{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/set-credentials" element={<SetCredentials />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
