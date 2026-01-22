import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0a0a0a',
            fontFamily: 'Manrope, sans-serif'
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #333'
            }}>
                <h2 style={{ color: '#ebcfb9', textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>

                {error && <div style={{ color: '#ff4d4d', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#222',
                                border: '1px solid #444',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none'
                            }}
                            placeholder="admin@arbanda.com"
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#222',
                                border: '1px solid #444',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none'
                            }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: '#ebcfb9',
                            color: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
