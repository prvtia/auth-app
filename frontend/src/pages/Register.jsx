import { useState } from "react";

function Register() 
{
    const [email, setEmail] = useState("");

    const handleRegister = (e) => 
    {
        e.preventDefault();
        console.log("Registering with:", email);
        // Call backend API to send OTP
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
