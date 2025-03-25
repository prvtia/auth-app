import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try 
        {
            const response = await API.post("/api/auth/login", { username, password });
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);
            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/"), 3000); // Adjust as needed
        } 
        catch (error) 
        {
            if (error.response?.status === 400) 
                {
                    const errorMsg = error.response.data.message;
                    if (errorMsg.includes("Invalid credentials")) 
                    {
                        setErrorMessage("Invalid credentials! Please try again.");
                    } 
                    else 
                    {
                        setErrorMessage(errorMsg || "Login failed. Please try again.");
                    }
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
        <div>
            <h2>Login</h2>
            {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
