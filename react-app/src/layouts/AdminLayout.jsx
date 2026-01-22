import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
