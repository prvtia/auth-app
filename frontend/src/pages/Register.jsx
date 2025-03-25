import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() 
{
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const sendOTP = async (e) => 
    {
        e.preventDefault();
        try 
        {
            const response = await API.post("/api/otp/send", { email });
            console.log(response.data);
            setStep(2); // Move to OTP verification step
        } 
        catch (error) 
        {
            console.error("Error sending OTP:", error.response.data);
        }
    };

    const verifyOTP = async (e) => 
    {
        e.preventDefault();
        console.log("Sending OTP verification request with:", { email, otp });
        try 
        {
            const response = await API.post("/api/otp/verify", { email, otp });
            console.log(response.data);
            // setStep(3); // Move to set credentials step
            navigate("/set-credentials",{state:{email}});
        } 
        catch (error) 
        {
            console.error("OTP verification failed:", error.response.data);
        }
    };

    const setCredentials = async (e) => 
    {
        e.preventDefault();
        try 
        {
            const response = await API.post("/api/auth/set-credentials", { email, username, password });
            console.log(response.data);
            navigate("/login"); // Redirect to login
        } 
        catch (error) 
        {
            console.error("Error setting credentials:", error.response.data);
        }
    };

    return (
        <div>
            <h2>Register</h2>

            {step === 1 && (
                <form onSubmit={sendOTP}>
                    <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit">Send OTP</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={verifyOTP}>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                    />
                    <button type="submit">Verify OTP</button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={setCredentials}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit">Register</button>
                </form>
            )}
        </div>
    );
}

export default Register;
