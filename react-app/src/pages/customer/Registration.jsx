import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Registration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
    const [showOtpField, setShowOtpField] = useState(false);

    const [emailData, setEmailData] = useState({ email: '', password: '', confirmPassword: '' });
    const [phoneData, setPhoneData] = useState({ phone: '', otp: '' });
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || "/profile";

    const handleGoogleSignup = async () => {
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

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (emailData.password !== emailData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: emailData.email,
                password: emailData.password,
            });
            if (signUpError) throw signUpError;
            alert('Registration successful! Please check your email for confirmation.');
            navigate('/login');
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
            let formattedPhone = phoneData.phone.trim();
            if (!formattedPhone.startsWith('+')) {
                formattedPhone = '+880' + formattedPhone.replace(/^0/, '');
            }

            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });
            if (otpError) throw otpError;
            setShowOtpField(true);
            alert('Verification code sent to your phone!');
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
            // For phone signup/login, it directly signs in
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section" style={{ minHeight: '100vh', background: '#fdf0e1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
            <div className="container" style={{ maxWidth: '480px' }}>
                <div style={{ background: '#fff0e5', padding: '50px 40px', borderRadius: '40px', border: '1px solid #ebcfb9', textAlign: 'center', boxShadow: '0 30px 60px rgba(38, 26, 19, 0.08)' }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @media (max-width: 479px) {
                            div[style*="background: #fff0e5"] {
                                padding: 40px 20px !important;
                                border-radius: 25px !important;
                            }
                            h2 {
                                font-size: 26px !important;
                            }
                        }
                    `}} />

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ background: '#261a13', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <span style={{ color: '#fff', fontSize: '24px' }}>✨</span>
                        </div>
                        <h2 style={{ color: '#261a13', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900' }}>Join Arbanda</h2>
                        <p style={{ color: '#8d7a6e', fontSize: '16px', margin: 0 }}>Discover a world of curated elegance</p>
                    </div>

                    {/* Social Signup */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        style={{ width: '100%', padding: '16px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '25px', transition: 'all 0.3s ease' }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                        SIGN UP WITH GOOGLE
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ flex: 1, height: '1px', background: '#ebcfb9' }}></div>
                        <span style={{ color: '#b08d74', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>or create account</span>
                        <div style={{ flex: 1, height: '1px', background: '#ebcfb9' }}></div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', background: '#fdf0e1', padding: '5px', borderRadius: '15px', marginBottom: '35px' }}>
                        <button
                            onClick={() => { setAuthMethod('email'); setError(null); setShowOtpField(false); }}
                            style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', background: authMethod === 'email' ? '#fdf0e1' : 'transparent', color: authMethod === 'email' ? '#261a13' : '#8d7a6e', boxShadow: authMethod === 'email' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
                        >
                            EMAIL
                        </button>
                        <button
                            onClick={() => { setAuthMethod('phone'); setError(null); setShowOtpField(false); }}
                            style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', background: authMethod === 'phone' ? '#fdf0e1' : 'transparent', color: authMethod === 'phone' ? '#261a13' : '#8d7a6e', boxShadow: authMethod === 'phone' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.3s' }}
                        >
                            PHONE (BD)
                        </button>
                    </div>

                    {error && (
                        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '15px', borderRadius: '15px', border: '1px solid #fadbd8', marginBottom: '30px', fontSize: '13px', fontWeight: '600' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {authMethod === 'email' ? (
                        <form onSubmit={handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={emailData.email}
                                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                                    style={{ width: '100%', padding: '18px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={emailData.password}
                                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                                    style={{ width: '100%', padding: '18px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={emailData.confirmPassword}
                                    onChange={(e) => setEmailData({ ...emailData, confirmPassword: e.target.value })}
                                    style={{ width: '100%', padding: '18px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="button w-button"
                                style={{ width: '100%', padding: '20px', marginTop: '15px', borderRadius: '40px', fontSize: '15px', fontWeight: '900', letterSpacing: '1px' }}
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={showOtpField ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' }}>Mobile Number</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ padding: '18px', background: '#f5f5f5', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#8d7a6e', fontSize: '16px', fontWeight: '700' }}>+880</div>
                                    <input
                                        type="tel"
                                        required
                                        disabled={showOtpField}
                                        value={phoneData.phone}
                                        onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                                        style={{ flex: 1, padding: '18px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '16px', outline: 'none' }}
                                        placeholder="17XXXXXXXX"
                                    />
                                </div>
                            </div>

                            {showOtpField && (
                                <div style={{ textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
                                    <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' }}>Verification Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={phoneData.otp}
                                        onChange={(e) => setPhoneData({ ...phoneData, otp: e.target.value })}
                                        style={{ width: '100%', padding: '18px', background: '#fdf0e1', border: '1px solid #ebcfb9', borderRadius: '15px', color: '#261a13', fontSize: '18px', fontWeight: '900', textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
                                        placeholder="XXXXXX"
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="button w-button"
                                style={{ width: '100%', padding: '20px', marginTop: '15px', borderRadius: '40px', fontSize: '15px', fontWeight: '900', letterSpacing: '1px' }}
                            >
                                {loading ? 'PROCESSING...' : (showOtpField ? 'VERIFY & SIGN UP' : 'REQUEST ACCESS CODE')}
                            </button>

                            {showOtpField && (
                                <button
                                    type="button"
                                    onClick={() => setShowOtpField(false)}
                                    style={{ background: 'none', border: 'none', color: '#8d7a6e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    Change mobile number
                                </button>
                            )}
                        </form>
                    )}

                    <p style={{ color: '#8d7a6e', marginTop: '40px', fontSize: '15px', fontWeight: '600' }}>
                        Already have access? <Link to="/login" state={{ from: location.state?.from }} style={{ color: '#261a13', textDecoration: 'none', fontWeight: '800', borderBottom: '2px solid #ebcfb9', paddingBottom: '2px' }}>Welcome Back</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;
