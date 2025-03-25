import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api";

const ForgotPassword = () =>
{
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSendOTP = async () =>
    {
        try
        {
            const response = await API.post("/api/otp/send", { email });
            console.log(response.data);
            setStep(2);
        }
        catch (error)
        {
            alert(error.response?.data?.message || 'Error sending OTP');
        }
    };

    const handleVerifyOTP = async () =>
    {
        try
        {
            const response = await API.post('/api/otp/verify', { email, otp });
            console.log(response.data);
            setStep(3);
            alert('OTP verified. Set your new password.');
        }
        catch (error)
        {
            alert(error.response?.data?.message || 'Error verifying OTP');
        }
    };

    const handleResetPassword = async () =>
    {
        try
        {
            await API.post('/api/auth/reset-password', { email, newPassword });
            alert('Password reset successfully');
            navigate('/login');
        }
        catch (error)
        {
            alert(error.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <h2>Forgot Password</h2>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSendOTP}>Send OTP</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Verify OTP</h2>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                    <button onClick={handleVerifyOTP}>Verify OTP</button>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h2>Reset Password</h2>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handleResetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
