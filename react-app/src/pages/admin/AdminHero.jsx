import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { Loader2, Save, LayoutTemplate, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminHero = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({});
    const [heroData, setHeroData] = useState({
        col1_image: '',
        col2_top_image: '',
        col2_bottom_image: '',
        center_image: '',
        col4_top_image: '',
        col4_bottom_image: '',
        col5_image: ''
    });

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const { data } = await supabase
                    .from('hero_section_content')
                    .select('*')
                    .limit(1)
                    .single();

                if (data) {
                    setHeroData({
                        col1_image: data.col1_image || '',
                        col2_top_image: data.col2_top_image || '',
                        col2_bottom_image: data.col2_bottom_image || '',
                        center_image: data.center_image || '',
                        col4_top_image: data.col4_top_image || '',
                        col4_bottom_image: data.col4_bottom_image || '',
                        col5_image: data.col5_image || ''
                    });
                }
            } catch (error) {
                console.log('No existing hero data found or error:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    const handleChange = (key, value) => {
        setHeroData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `hero/${fileName}`;

            // Upload to 'product-images' bucket (Shared with products to avoid new setup)
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            handleChange(field, publicUrl);
            toast.success('Image uploaded!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed: ' + error.message);
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase
                .from('hero_section_content')
                .select('id')
                .limit(1)
                .single();

            if (existing) {
                await supabase
                    .from('hero_section_content')
                    .update(heroData)
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('hero_section_content')
                    .insert([heroData]);
            }
            toast.success('Hero section updated successfully!');
        } catch (error) {
            console.error('Error saving hero data:', error);
            toast.error('Failed to update hero section.');
        } finally {
            setSaving(false);
        }
    };

    const ImageInput = ({ label, field }) => (
        <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>
                {label}
            </label>

            {/* Main Control Area */}
            <div style={{ background: '#27272a', border: '1px solid #3f3f46', borderRadius: '12px', padding: '16px' }}>

                {/* Preview & Upload Row */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    {/* Preview Box */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        background: '#18181b',
                        border: '1px dashed #52525b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {heroData[field] ? (
                            <img
                                src={heroData[field]}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <ImageIcon size={24} color="#52525b" />
                        )}
                        {uploading[field] && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Loader2 size={20} className="animate-spin" color="#fff" />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ flex: 1 }}>
                        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                background: '#3f3f46',
                                color: '#fff',
                                border: '1px solid #52525b',
                                borderRadius: '8px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}>
                                <Upload size={14} />
                                {uploading[field] ? 'Uploading...' : 'Upload Image'}
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, field)}
                                disabled={uploading[field]}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: '#71717a', margin: '6px 0 0 0' }}>
                            Supported: JPG, PNG, WEBP. Max 5MB.
                        </p>
                    </div>
                </div>

                {/* URL Fallback */}
                <div>
                    <input
                        type="text"
                        value={heroData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder="https://..."
                        style={{
                            width: '100%',
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: '#a1a1aa', // Muted text for URL
                            fontSize: '12px', // Smaller font for URL
                            outline: 'none',
                            fontFamily: 'monospace'
                        }}
                    />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ height: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PremiumLoader text="Loading Hero Config..." />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <LayoutTemplate color="#d946ef" /> Hero Section Manager
                    </h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>
                        Manage home page hero images via direct upload or URL.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: '#d946ef',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

                {/* Left Column Controls */}
                <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Left & Inner Left</h3>
                    <ImageInput label="Column 1 (Far Left)" field="col1_image" />
                    <ImageInput label="Column 2 (Top)" field="col2_top_image" />
                    <ImageInput label="Column 2 (Bottom)" field="col2_bottom_image" />
                </div>

                {/* Center Control */}
                <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Center Hero</h3>
                    <div style={{ background: 'rgba(217, 70, 239, 0.1)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', color: '#d946ef', margin: 0 }}>
                            <b>Quick Tip:</b> Upload a high-quality vertical portrait for best results.
                        </p>
                    </div>
                    <ImageInput label="Center Image (Main)" field="center_image" />
                </div>

                {/* Right Column Controls */}
                <div style={{ background: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Right & Inner Right</h3>
                    <ImageInput label="Column 4 (Top)" field="col4_top_image" />
                    <ImageInput label="Column 4 (Bottom)" field="col4_bottom_image" />
                    <ImageInput label="Column 5 (Far Right)" field="col5_image" />
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminHero;
