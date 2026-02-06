import React from 'react';
import { Loader2 } from 'lucide-react';

const PremiumLoader = ({ text = "Loading..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            width: '100%',
            height: '100%',
            minHeight: '200px'
        }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '24px' }}>
                {/* Outer glowing ring */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: '#d946ef', // Fuchsia
                    borderRightColor: '#a855f7', // Purple
                    animation: 'spin 1.5s linear infinite',
                    filter: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.5))'
                }}></div>

                {/* Inner spinning ring (reverse) */}
                <div style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderBottomColor: '#fbbf24', // Amber/Gold
                    borderLeftColor: '#f59e0b',
                    animation: 'spin-reverse 2s linear infinite'
                }}></div>

                {/* Center Logo/Icon */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s ease-in-out infinite'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        background: '#fff',
                        borderRadius: '2px',
                        transform: 'rotate(45deg)',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                    }}></div>
                </div>
            </div>

            <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                color: '#a1a1aa',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                animation: 'pulse-text 2s ease-in-out infinite'
            }}>
                {text}
            </div>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.85); opacity: 0.7; }
          }
           @keyframes pulse-text {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

export default PremiumLoader;
