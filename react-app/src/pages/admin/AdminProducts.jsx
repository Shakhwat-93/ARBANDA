import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AddProductModal from '../../components/admin/AddProductModal';
import { supabase } from '../../supabaseClient';

const AdminProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (!error) fetchProducts();
        }
    };

    return (
        <AdminLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ color: '#ebcfb9', margin: 0 }}>Product Management</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Manage your product catalog and inventory.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '12px 24px',
                        background: '#ebcfb9',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    + Add New Product
                </button>
            </div>

            <div style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead style={{ background: '#222' }}>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Stock</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#666' }}>No products found. Add your first one!</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={tdStyle}>{product.name}</td>
                                    <td style={tdStyle}>{product.category}</td>
                                    <td style={tdStyle}>${product.price}</td>
                                    <td style={tdStyle}>{product.stock}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductAdded={fetchProducts}
            />
        </AdminLayout>
    );
};

const thStyle = { padding: '15px 20px', textAlign: 'left', color: '#888', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #333' };
const tdStyle = { padding: '15px 20px', fontSize: '15px' };

export default AdminProducts;
