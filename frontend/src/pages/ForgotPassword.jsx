import { useState } from "react";

function ForgotPassword() 
{
    const [email, setEmail] = useState("");

    const handleReset = (e) => 
    {
        e.preventDefault();
        console.log("Sending OTP to:", email);
        // Call backend API to send OTP for password reset
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleReset}>
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

export default ForgotPassword;
