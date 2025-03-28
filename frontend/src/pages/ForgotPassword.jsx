import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api";

const ForgotPassword = () => 
{
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [otpTimer, setOtpTimer] = useState(60);
    const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(3);
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    const navigate = useNavigate();

    useEffect(() => 
    {
        if (step === 2 && otpTimer > 0) 
        {
            const timer = setInterval(() => 
            {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } 
        else if (otpTimer === 0) 
        {
            setError("OTP expired. Redirecting...");
            setTimeout(() => navigate('/'), 3000);
        }
    }, [otpTimer, step]);

    // Validate password as user types
    const validatePassword = (password) => 
    {
        const rules = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&]/.test(password)
        };
        setPasswordRules(rules);

        return Object.values(rules).every(Boolean);
    };

    const handlePasswordChange = (e) => 
    {
        const newPassword = e.target.value;
        setNewPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleSendOTP = async () => 
    {
        try 
        {
            const response = await API.post("/api/otp/send", { email });
            setMessage(response.data.message || "OTP sent successfully");
            setError('');
            setOtpTimer(60);
            setOtpAttemptsLeft(3);
            setStep(2);
        } 
        catch (error) 
        {
            setError(error.response?.data?.message || 'Error sending OTP');
            setMessage('');
        }
    };

    const handleVerifyOTP = async () => 
    {
        if (otpTimer === 0) 
        {
            setMessage('');
            setError("OTP expired. Redirecting...");
            setTimeout(() => navigate('/'), 3000);
            return;
        }
        try 
        {
            const response = await API.post('/api/otp/verify', { email, otp });
            setMessage(response.data.message || "OTP verified. Set your new password.");
            setError('');
            setStep(3);
        } 
        catch (error) 
        {
            if (otpAttemptsLeft > 1) 
            {
                setOtpAttemptsLeft(otpAttemptsLeft - 1);
                setError(`Incorrect OTP. Attempts left: ${otpAttemptsLeft - 1}`);
                setMessage('');
            } 
            else 
            {
                setError("Maximum OTP attempts reached. Redirecting...");
                setTimeout(() => navigate('/'), 3000);
            }
        }
    };

    const handleResetPassword = async () => 
    {
        if (!validatePassword(newPassword)) 
        {
            setError("Please ensure your password meets all the requirements.");
            return;
        }

        try 
        {
            await API.post('/api/auth/reset-password', { email, newPassword });
            setMessage("Password reset successfully! Redirecting to login...");
            setError('');
            setTimeout(() => navigate('/login'), 3000);
        } 
        catch (error) 
        {
            setError(error.response?.data?.message || 'Error resetting password');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <div style={{ color: "green" }}>{message}</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            {step === 1 && (
                <div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        required
                    />
                    <button onClick={handleVerifyOTP}>Verify OTP</button>
                    <p>OTP expires in: <b>{otpTimer}s</b></p>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2>Reset Password</h2>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    <ul style={{listStyle:"none"}}>
                        <li style={{ color: passwordRules.length ? "green" : "red" }}>
                            {passwordRules.length ? "✅" : "❌"} At least 8 characters
                        </li>
                        <li style={{ color: passwordRules.uppercase ? "green" : "red" }}>
                            {passwordRules.uppercase ? "✅" : "❌"} At least one uppercase letter
                        </li>
                        <li style={{ color: passwordRules.lowercase ? "green" : "red" }}>
                            {passwordRules.lowercase ? "✅" : "❌"} At least one lowercase letter
                        </li>
                        <li style={{ color: passwordRules.number ? "green" : "red" }}>
                            {passwordRules.number ? "✅" : "❌"} At least one number
                        </li>
                        <li style={{ color: passwordRules.specialChar ? "green" : "red" }}>
                            {passwordRules.specialChar ? "✅" : "❌"} At least one special character (@$!%*?&)
                        </li>
                    </ul>
                    <button onClick={handleResetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
