import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setMessage('Password reset link has been sent to your email. Please check your inbox.');
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
                        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔑</div>
                        <h2 style={{ color: '#261a13', margin: 0, fontSize: '32px' }}>Reset Password</h2>
                        <p style={{ color: '#8d7a6e', marginTop: '12px', fontSize: '16px' }}>Enter your email to receive a recovery link</p>
                    </div>

                    {message && (
                        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '12px', border: '1px solid #c8e6c9', marginBottom: '25px', fontSize: '14px' }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '15px', borderRadius: '12px', border: '1px solid #fadbd8', marginBottom: '25px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', color: '#b08d74', marginBottom: '10px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '16px', background: '#fff0e5', border: '1px solid #ebcfb9', borderRadius: '12px', color: '#261a13', fontSize: '16px' }}
                                    placeholder="name@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="button w-button"
                                style={{ width: '100%', padding: '18px', marginTop: '15px', borderRadius: '40px', fontSize: '16px', letterSpacing: '2px' }}
                            >
                                {loading ? 'SENDING LINK...' : 'SEND RECOVERY LINK'}
                            </button>
                        </form>
                    )}

                    <p style={{ color: '#8d7a6e', marginTop: '40px', fontSize: '15px' }}>
                        Remember your password? <Link to="/login" style={{ color: '#261a13', textDecoration: 'none', fontWeight: '700', borderBottom: '2px solid #ebcfb9' }}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
