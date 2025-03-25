import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");

        try 
        {
            const response = await API.post("/api/auth/login", { username, password });
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem("token", token);
            alert("Login successful!");
            navigate("/"); // Adjust as needed
        } 
        catch (error) 
        {
            setErrorMessage(error.response?.data?.message || "Error logging in. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
