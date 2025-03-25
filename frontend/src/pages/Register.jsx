import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Register() 
{
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const sendOTP = async (e) => 
    {
        e.preventDefault();
        try 
        {
            const response = await API.post("/api/otp/send", { email });
            console.log(response.data);
            navigate("/verify-otp",{state:{email}});
        } 
        catch (error) 
        {
            console.error("Error sending OTP:", error.response.data);
        }
    };

    return (
        <div>
            <h2>Register</h2>
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
        </div>
    );
}

export default Register;
