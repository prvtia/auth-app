import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import SetCredentials from "./pages/SetCredentials";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import FaceReg from "./pages/faceRegistration";
import LoggedIn from "./pages/LoggedInPage";

function App() 
{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/set-credentials" element={<SetCredentials />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register-with-face" element={<FaceReg/>} />
                <Route path="/logged-in" element={<LoggedIn/>}/>
            </Routes>
        </Router>
    );
}

export default App;
