import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { Construction, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ title = "Under Development", description = "We are working hard to bring you this feature. Stay tuned!" }) => {
    const navigate = useNavigate();

    return (
        <AdminLayout>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
                textAlign: 'center',
                color: '#fff'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
                    padding: '40px',
                    borderRadius: '50%',
                    marginBottom: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.1)'
                }}>
                    <Construction size={64} style={{ color: '#d8b4fe' }} />
                </div>

                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    background: 'linear-gradient(to right, #fff, #a1a1aa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {title}
                </h1>

                <p style={{
                    color: '#a1a1aa',
                    fontSize: '16px',
                    maxWidth: '400px',
                    lineHeight: '1.6',
                    marginBottom: '40px'
                }}>
                    {description}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#27272a',
                        border: '1px solid #3f3f46',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#3f3f46'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#27272a'; }}
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>
            </div>
        </AdminLayout>
    );
};

export default ComingSoon;
