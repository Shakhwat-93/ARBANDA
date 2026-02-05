import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top Bar Placeholder - Can be extracted to a separate component later */}
                <div style={{
                    height: '70px',
                    borderBottom: '1px solid #27272a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 32px',
                    background: 'rgba(9, 9, 11, 0.8)',
                    backdropFilter: 'blur(8px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40
                }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#71717a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Type here to start searching..."
                            style={{
                                width: '100%',
                                background: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: '8px',
                                padding: '10px 10px 10px 40px',
                                color: '#e4e4e7',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Notification Icon */}
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', background: '#ec4899', borderRadius: '50%', border: '2px solid #09090b' }}></div>
                        </div>

                        {/* Profile Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right', display: 'none', lg: 'block' }}>
                                <p style={{ fontSize: '13px', fontWeight: '500', margin: 0 }}>Admin User</p>
                                <p style={{ fontSize: '11px', color: '#71717a', margin: 0 }}>Super Admin</p>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#27272a', overflow: 'hidden' }}>
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff" alt="Profile" style={{ width: '100%', height: '100%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
