import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('0');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let image_url = 'https://placehold.co/600x400?text=No+Image';

            // 1. Upload image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            // 2. Insert product
            const { error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        name,
                        description,
                        price: parseFloat(price),
                        category,
                        stock: parseInt(stock),
                        image_url
                    }
                ]);

            if (insertError) throw insertError;

            // Reset form
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStock('0');
            setImageFile(null);
            onProductAdded();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '30px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '500px',
                border: '1px solid #333',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ color: '#ebcfb9', marginTop: 0 }}>Add New Product</h2>
                {error && <p style={{ color: '#ff4d4d', fontSize: '14px' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Product Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Main Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={fileInputStyle} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} required style={inputStyle}>
                            <option value="">Select Category</option>
                            <option value="Skincare">Skincare</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Electronics">Electronics</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Price ($)</label>
                            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Stock</label>
                            <input type="number" value={stock} onChange={e => setStock(e.target.value)} required style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '14px' }}>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, height: '80px' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={loading} style={primaryButtonStyle}>
                            {loading ? 'Processing...' : 'Add Product'}
                        </button>
                        <button type="button" onClick={onClose} style={secondaryButtonStyle}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    background: '#222',
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#fff',
    outline: 'none',
    fontSize: '14px'
};

const fileInputStyle = {
    width: '100%',
    padding: '8px',
    background: '#222',
    border: '1px dashed #444',
    borderRadius: '6px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '13px'
};

const primaryButtonStyle = {
    flex: 1,
    padding: '12px',
    background: '#ebcfb9',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    opacity: 1
};

const secondaryButtonStyle = {
    padding: '12px 20px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #444',
    borderRadius: '8px',
    cursor: 'pointer'
};

export default AddProductModal;
