import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

function VerifyOTP() 
{
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [timer, setTimer] = useState(45); // Countdown timer
    const [attempts, setAttempts] = useState(0); // Attempts tracker
    const email = location.state?.email;

    useEffect(()=>
    {
        if(!email)
        {
            navigate("/register");
        }
        const countdown = setInterval(() => 
            {
                setTimer((prev) => 
                {
                    if (prev <= 1) 
                    {
                        clearInterval(countdown);
                        setTimeout(() => navigate("/register"), 3000); // Redirect user to register when timer expires after 3s delay
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => {
                clearInterval(countdown);
            };
    },[email,navigate]);

    useEffect(() => {
        if (attempts > 0 && attempts < 3) {
            const remainingAttempts = 3 - attempts;
            setErrorMessage(`Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} left.`);
        }
    }, [attempts]);

    const handleVerify = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");

        try 
        {
            const response = await API.post("/api/otp/verify", { email, otp });
            console.log("Response:", response.data); // Log server response

            if (response.data.message === "OTP verified successfully") 
            {
                navigate("/set-credentials", { state: { email } });
            }
            else 
            {
                setAttempts((prev) => prev + 1); // Increment failed attempts
                setErrorMessage(response.data.message);
            }
        } 
        catch (error) {
            console.error("Error response:", error.response?.data);
        
            setAttempts((prev_attempts) => {
                const newAttempts = prev_attempts + 1;
        
                if (newAttempts >= 3) {
                    //setErrorMessage("Max attempts reached. Redirecting to registration...");
                    setTimeout(() => navigate("/register"), 3000);
                }         
                return newAttempts;
            });
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <p>Time remaining: <strong>{timer} seconds</strong></p>
            {/* <p>Attempts left: <strong>{3 - attempts}</strong></p> */}
            <form onSubmit={handleVerify}>
                <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    disabled={timer === 0 || attempts>=3} // Disable input when timer runs out or max attempts reached
                />
                <button type="submit">Verify</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {timer === 0 && <p style={{ color: "blue" }}>OTP expired. Redirecting to registration page...</p>}
            {attempts >= 3 && <p style={{ color: "blue" }}>Maximum attempts reached. Redirecting to registration page...</p>}
        </div>
    );
}

export default VerifyOTP;
