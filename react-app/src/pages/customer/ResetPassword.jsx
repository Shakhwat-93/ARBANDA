import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Double check session in case the recovery link didn't set it (Supabase handles this automatically on the redirect)
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                console.log('Password recovery mode active');
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section" style={{ minHeight: '100vh', background: '#fdf0e1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
            <div className="container" style={{ maxWidth: '450px' }}>
                <div style={{ background: '#fff', padding: '45px', borderRadius: '30px', border: '1px solid #ebcfb9', textAlign: 'center', boxShadow: '0 20px 40px rgba(38, 26, 19, 0.05)' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🛡️</div>
                        <h2 style={{ color: '#261a13', margin: 0, fontSize: '32px' }}>New Password</h2>
                        <p style={{ color: '#8d7a6e', marginTop: '12px', fontSize: '16px' }}>Set your new secure password</p>
                    </div>

                    {success ? (
                        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '20px', borderRadius: '12px', border: '1px solid #c8e6c9', marginBottom: '10px' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
                            Password updated successfully! Redirecting to login...
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div style={{ background: '#fff0f0', color: '#c0392b', padding: '15px', borderRadius: '12px', border: '1px solid #fadbd8', marginBottom: '25px', fontSize: '14px' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', padding: '16px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', color: '#261a13', fontSize: '16px' }}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div style={{ textAlign: 'left' }}>
                                    <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ width: '100%', padding: '16px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', color: '#261a13', fontSize: '16px' }}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="button w-button"
                                    style={{ width: '100%', padding: '18px', marginTop: '15px', borderRadius: '40px', fontSize: '16px', letterSpacing: '2px' }}
                                >
                                    {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
