import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

function SetCredentials() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSetCredentials = async (e) => 
    {
        e.preventDefault();

        try 
        {
            const response = await API.post("/api/auth/register", { email, username, password });

            if (response.data.message === "User registered successfully") 
            {
                alert("Registration successful! Please log in.");
                navigate("/login");
            }
            else 
            {
                alert(response.data.message);
            }
        } 
        catch (error) 
        {
            alert("Error setting credentials. Please try again.");
        }
    };

    return (
        <div>
            <h2>Set Credentials</h2>
            <form onSubmit={handleSetCredentials}>
                <input 
                    type="text" 
                    placeholder="Enter Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Complete Registration</button>
            </form>
        </div>
    );
}

export default SetCredentials;
