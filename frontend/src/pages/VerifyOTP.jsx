import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";

function VerifyOTP() 
{
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const email = location.state?.email;

    useEffect(()=>
    {
        if(!email)
        {
            navigate("/register");
        }
    },[email,navigate]);
    const handleVerify = async (e) => 
    {
        e.preventDefault();
        setErrorMessage("");

        try 
        {
            const response = await API.post("/api/otp/verify", { email, otp });

            if (response.data.message === "OTP verified successfully") 
            {
                navigate("/set-credentials", { state: { email } });
            }
            else 
            {
                setErrorMessage(response.data.message);
            }
        } 
        catch (error) 
        {
            setErrorMessage(error.response?.data?.messgae || "Error verifiying OTP. Please try again.");
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleVerify}>
                <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                />
                <button type="submit">Verify</button>
            </form>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}

export default VerifyOTP;