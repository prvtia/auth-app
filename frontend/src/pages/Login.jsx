import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const navigate = useNavigate();

    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (attemptsLeft === 0) 
        {
            setErrorMessage("Maximum login attempts reached. Redirecting...");
            setTimeout(() => navigate('/') , 3000);
            return;
        }

        try 
        {
            const response = await API.post("/api/auth/login", { username, password });
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);
            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/logged-in"), 3000); // Adjust as needed
        } 
        catch (error) 
        {
            if (error.response?.status === 400) 
                {
                    setAttemptsLeft(prev => 
                    {
                        if (prev === 1) 
                        {
                            setErrorMessage("Maximum login attempts reached. Redirecting...");
                            setTimeout(() => navigate('/') , 3000);
                            return 0;
                        } 
                        else 
                        {
                            setErrorMessage(`Invalid credentials! Attempts left: ${prev - 1}`);
                            return prev - 1;
                        }
                    });
    
                    setUsername(""); 
                    setPassword(""); 
                } 
            else
            {
                setErrorMessage(error.response?.data?.message || "Error logging in. Please try again.");
            }
            
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {errorMessage && <div style={{ color: "#f47174", marginBottom: "10px" }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: "#6fdc8c", marginBottom: "10px" }}>{successMessage}</div>}
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    disabled={attemptsLeft === 0}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={attemptsLeft === 0}
                />
                 <button type="submit" disabled={attemptsLeft === 0}>Login</button>
            </form>
        </div>
    );
}

export default Login;
