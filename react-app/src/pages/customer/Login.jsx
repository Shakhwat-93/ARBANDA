import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
    const [showOtpField, setShowOtpField] = useState(false);

    const [emailData, setEmailData] = useState({ email: '', password: '' });
    const [phoneData, setPhoneData] = useState({ phone: '', otp: '' });
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || "/profile";

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/profile`
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: emailData.email,
                password: emailData.password,
            });
            if (signInError) throw signInError;
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Ensure number starts with +880
            let formattedPhone = phoneData.phone.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+880' + formattedPhone.replace(/^0/, '');
            }

            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });
            if (otpError) throw otpError;
            setShowOtpField(true);
            alert('OTP has been sent to your phone!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            let formattedPhone = phoneData.phone.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+880' + formattedPhone.replace(/^0/, '');
            }

            const { error: verifyError } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: phoneData.otp,
                type: 'sms'
            });
            if (verifyError) throw verifyError;
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-wrapper" style={{ minHeight: '100vh', background: '#fdf0e1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
            <div className="container" style={{ maxWidth: '900px', width: '100%', display: 'flex', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(38, 26, 19, 0.1)' }}>

                {/* Image Side (Left) */}
                <div className="image-side" style={{ flex: '1.2', background: '#261a13', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.8 }}>
                        {/* Placeholder or Generated Image */}
                        <img
                            src="/auth_flower_welcome.svg"
                            alt="Welcome"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(38, 26, 19, 0.1), rgba(38, 26, 19, 0.6))' }}></div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: '700', marginBottom: '15px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Welcome Back</h1>
                        <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.6', maxWidth: '300px', margin: '0 auto' }}>Log in to access your curated collection of premium essentials.</p>
                    </div>
                </div>

                {/* Form Side (Right) */}
                <div className="login-container" style={{ flex: '1', background: 'rgba(255, 240, 229, 0.95)', backdropFilter: 'blur(20px)', padding: '50px 40px', textAlign: 'center' }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .minimal-input-group {
                            position: relative;
                            margin-bottom: 25px;
                        }
                        .minimal-input {
                            width: 100%;
                            padding: 15px 0;
                            background: transparent !important;
                            border: none;
                            border-bottom: 2px solid #e0cbbd;
                            color: #261a13;
                            font-size: 16px;
                            font-weight: 500;
                            transition: all 0.3s ease;
                            border-radius: 0;
                        }
                        .minimal-input:focus {
                            outline: none;
                            border-bottom-color: #261a13;
                        }
                        .input-icon {
                            position: absolute;
                            right: 0;
                            top: 15px;
                            color: #8d7a6e;
                            pointer-events: none;
                            font-size: 18px;
                            transition: color 0.3s ease;
                        }
                        .minimal-input:focus + .input-icon {
                            color: #261a13;
                        }
                        .custom-button {
                            width: 100%;
                            padding: 16px;
                            margin-top: 20px;
                            border-radius: 30px;
                            font-size: 15px;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                            background: linear-gradient(135deg, #261a13 0%, #3e2b20 100%);
                            color: #ffffff;
                            border: none;
                            cursor: pointer;
                            box-shadow: 0 10px 20px rgba(38, 26, 19, 0.15);
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                        }
                        .custom-button:active {
                            transform: scale(0.98);
                            box-shadow: 0 5px 10px rgba(38, 26, 19, 0.1);
                        }
                        .tab-button {
                            padding: 10px 20px;
                            border: none;
                            background: transparent;
                            color: #8d7a6e;
                            font-weight: 600;
                            font-size: 14px;
                            cursor: pointer;
                            position: relative;
                            transition: color 0.3s;
                        }
                        .tab-button.active {
                            color: #261a13;
                        }
                        .tab-button.active::after {
                            content: '';
                            position: absolute;
                            bottom: -5px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 20px;
                            height: 3px;
                            background: #261a13;
                            border-radius: 2px;
                        }
                        @media (max-width: 900px) {
                            .container { flex-direction: column; max-width: 480px !important; }
                            .image-side { display: none !important; } /* Hide image on mobile for minimal look */
                            .login-container { padding: 40px 30px !important; }
                        }
                    `}} />

                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ color: '#261a13', margin: '0 0 5px 0', fontSize: '28px', fontWeight: '800' }}>Login</h2>
                        <p style={{ color: '#8d7a6e', fontSize: '14px', margin: 0 }}>Glad to see you back</p>
                    </div>

                    {/* Minimal Tabs */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                        <button
                            className={`tab-button ${authMethod === 'email' ? 'active' : ''}`}
                            onClick={() => { setAuthMethod('email'); setError(null); setShowOtpField(false); }}
                        >
                            Email
                        </button>
                        <button
                            className={`tab-button ${authMethod === 'phone' ? 'active' : ''}`}
                            onClick={() => { setAuthMethod('phone'); setError(null); setShowOtpField(false); }}
                        >
                            Phone
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '12px', borderRadius: '12px', marginBottom: '25px', fontSize: '13px', fontWeight: '500' }}>
                            {error}
                        </div>
                    )}

                    {authMethod === 'email' ? (
                        <form onSubmit={handleEmailLogin}>
                            <div className="minimal-input-group">
                                <input
                                    type="email"
                                    required
                                    className="minimal-input"
                                    placeholder="Email Address"
                                    value={emailData.email}
                                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                                />
                                <span className="input-icon">✉️</span>
                            </div>

                            <div className="minimal-input-group">
                                <input
                                    type="password"
                                    required
                                    className="minimal-input"
                                    placeholder="Password"
                                    value={emailData.password}
                                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                                />
                                <span className="input-icon">🔒</span>
                            </div>

                            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                <Link to="/forgot-password" style={{ color: '#8d7a6e', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</Link>
                            </div>

                            <button type="submit" disabled={loading} className="custom-button">
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp}>
                            <div className="minimal-input-group" style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '16px', fontWeight: '600', color: '#8d7a6e', marginRight: '10px', paddingBottom: '2px' }}>+880</span>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        type="tel"
                                        required
                                        disabled={showOtpField}
                                        className="minimal-input"
                                        placeholder="17XXXXXXXX"
                                        value={phoneData.phone}
                                        onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                                    />
                                    <span className="input-icon">📞</span>
                                </div>
                            </div>

                            {showOtpField && (
                                <div className="minimal-input-group" style={{ marginTop: '10px', animation: 'fadeIn 0.3s ease' }}>
                                    <input
                                        type="text"
                                        required
                                        className="minimal-input"
                                        placeholder="OTP Code"
                                        style={{ textAlign: 'center', letterSpacing: '5px', fontWeight: 'bold' }}
                                        value={phoneData.otp}
                                        onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="custom-button">
                                {loading ? 'Processing...' : (showOtpField ? 'Verify & Login' : 'Get OTP')}
                            </button>

                            {showOtpField && (
                                <button type="button" onClick={() => setShowOtpField(false)} style={{ background: 'none', border: 'none', color: '#8d7a6e', fontSize: '12px', fontWeight: '600', marginTop: '15px', cursor: 'pointer' }}>
                                    Try different number
                                </button>
                            )}
                        </form>
                    )}

                    <div style={{ marginTop: '30px' }}>
                        <p style={{ color: '#8d7a6e', fontSize: '14px' }}>
                            Don't have an account? <Link to="/register" style={{ color: '#261a13', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
                        </p>
                    </div>

                    {/* Subtle Google Login */}
                    <div style={{ marginTop: '30px', borderTop: '1px solid rgba(235, 207, 185, 0.5)', paddingTop: '20px' }}>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{ background: 'transparent', border: 'none', color: '#8d7a6e', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '16px', opacity: 0.7 }} />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
