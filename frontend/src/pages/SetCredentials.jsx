import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

function SetCredentials() 
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(()=>
    {
        if(!email)
        {
            navigate("/register");
        }
    },[email,navigate]);

    useEffect(() => {
        setUsername("");
        setPassword("");
    }, [location]);

    const handleSetCredentials = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try 
        {
            const response = await API.post("/api/auth/set-credentials", { email, username, password });

            if (response.data.message === "User credentials set successfully") 
            {
                setSuccessMessage("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
            }
            else
            {
                setErrorMessage(response.data.message);
                setTimeout(() => navigate("/register"), 3000);
            }
        } 
        catch (error) 
        {
            if (error.response?.status === 400) 
                {
                    const errorMsg = error.response.data.message;

                    if (errorMsg === "Username already taken") 
                    {
                        setErrorMessage("This username is already taken. Please choose another one.");
                        setTimeout(() => navigate("/set-credentials", { state: { email } }), 3000);
                    } 
                    else if (errorMsg === "Email already registered") 
                    {
                        setErrorMessage("This email is already registered. Please use a different email.");
                        setTimeout(() => navigate("/register"), 3000);
                    }
                    else 
                    {
                        setErrorMessage(errorMsg || "Invalid registration details. Please try again.");
                        setTimeout(() => navigate("/register"), 3000);
                    }
                } 
            else 
            {
                setErrorMessage("Error during registration. Please try again.");
                setTimeout(() => navigate("/register"), 3000);
            }
        }
    };

    return (
        <div>
            <h2>Set Credentials</h2>
            {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>}
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
