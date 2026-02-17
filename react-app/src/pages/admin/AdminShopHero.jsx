import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../supabaseClient';
import { Loader2, Save, LayoutTemplate, Upload, Image as ImageIcon, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumLoader from '../../components/common/PremiumLoader';

const AdminShopHero = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({});
    const [heroData, setHeroData] = useState({
        slides: [],
        banners: []
    });

    useEffect(() => {
        fetchHeroData();
    }, []);

    const fetchHeroData = async () => {
        try {
            const { data } = await supabase
                .from('shop_hero_content')
                .select('*')
                .limit(1)
                .single();

            if (data) {
                // Ensure banners has 4 slots
                let banners = data.banners || [];
                if (banners.length < 4) {
                    for (let i = banners.length; i < 4; i++) {
                        banners.push({ id: Date.now() + i, image_url: '', title: '', link: '' });
                    }
                }
                setHeroData({
                    slides: data.slides || [],
                    banners: banners
                });
            } else {
                // Initialize default state if no data
                setHeroData({
                    slides: [],
                    banners: Array(4).fill().map((_, i) => ({ id: Date.now() + i, image_url: '', title: '', link: '' }))
                });
            }
        } catch (error) {
            console.log('No existing hero data found or error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSlideChange = (index, field, value) => {
        const newSlides = [...heroData.slides];
        newSlides[index][field] = value;
        setHeroData(prev => ({ ...prev, slides: newSlides }));
    };

    const handleBannerChange = (index, field, value) => {
        const newBanners = [...heroData.banners];
        newBanners[index][field] = value;
        setHeroData(prev => ({ ...prev, banners: newBanners }));
    };

    const addSlide = () => {
        setHeroData(prev => ({
            ...prev,
            slides: [...prev.slides, { id: Date.now(), image_url: '', title: '', subtitle: '', link: '' }]
        }));
    };

    const removeSlide = (index) => {
        const newSlides = heroData.slides.filter((_, i) => i !== index);
        setHeroData(prev => ({ ...prev, slides: newSlides }));
    };

    const moveSlide = (index, direction) => {
        const newSlides = [...heroData.slides];
        if (direction === 'up' && index > 0) {
            [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
        } else if (direction === 'down' && index < newSlides.length - 1) {
            [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        }
        setHeroData(prev => ({ ...prev, slides: newSlides }));
    };

    const handleFileUpload = async (e, type, index, field = 'image_url') => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadKey = `${type}-${index}`;
        setUploading(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `shop-hero/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images') // Reusing bucket
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            if (type === 'slide') {
                handleSlideChange(index, field, publicUrl);
            } else {
                handleBannerChange(index, field, publicUrl);
            }
            toast.success('Image uploaded!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed: ' + error.message);
        } finally {
            setUploading(prev => ({ ...prev, [uploadKey]: false }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase
                .from('shop_hero_content')
                .select('id')
                .limit(1)
                .single();

            if (existing) {
                await supabase
                    .from('shop_hero_content')
                    .update(heroData)
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('shop_hero_content')
                    .insert([heroData]);
            }
            toast.success('Shop Hero section updated successfully!');
        } catch (error) {
            console.error('Error saving hero data:', error);
            toast.error('Failed to update hero section.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLayout><PremiumLoader text="Loading Config..." /></AdminLayout>;

    return (
        <AdminLayout>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <LayoutTemplate color="#d946ef" /> Shop Hero Manager
                    </h1>
                    <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>
                        Manage the slider and banner grid on the Shop page.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                        background: '#d946ef', border: 'none', borderRadius: '8px',
                        color: '#fff', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                    }}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Slider Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', margin: 0 }}>Main Slider</h2>
                    <button onClick={addSlide} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                        <Plus size={14} /> Add Slide
                    </button>
                </div>

                {heroData.slides.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', background: '#18181b', borderRadius: '12px', border: '1px dashed #3f3f46', color: '#71717a' }}>
                        No slides added yet. Click "Add Slide" to start.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {heroData.slides.map((slide, index) => (
                            <div key={slide.id} style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', gap: '20px', alignItems: 'start' }}>
                                {/* Image Upload */}
                                <div style={{ width: '150px', flexShrink: 0 }}>
                                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#27272a', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '8px', border: '1px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {slide.image_url ? (
                                            <img src={slide.image_url} alt="Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <ImageIcon size={24} color="#52525b" />
                                        )}
                                        {uploading[`slide-${index}`] && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Loader2 size={20} className="animate-spin" color="#fff" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                                        <button style={{ width: '100%', padding: '6px', background: '#3f3f46', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Upload Image</button>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'slide', index)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}>Title</label>
                                        <input type="text" value={slide.title} onChange={(e) => handleSlideChange(index, 'title', e.target.value)} style={inputStyle} placeholder="e.g. Summer Collection" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}>Subtitle</label>
                                        <input type="text" value={slide.subtitle} onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)} style={inputStyle} placeholder="e.g. Up to 50% Off" />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}>Link URL</label>
                                        <input type="text" value={slide.link} onChange={(e) => handleSlideChange(index, 'link', e.target.value)} style={inputStyle} placeholder="/shop?category=summer" />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} style={actionButtonStyle}><ArrowUp size={16} /></button>
                                    <button onClick={() => moveSlide(index, 'down')} disabled={index === heroData.slides.length - 1} style={actionButtonStyle}><ArrowDown size={16} /></button>
                                    <button onClick={() => removeSlide(index)} style={{ ...actionButtonStyle, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Banners Section */}
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '20px' }}>Banner Grid (4 Items)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {heroData.banners.map((banner, index) => (
                        <div key={banner.id} style={{ background: '#18181b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#a1a1aa', marginBottom: '12px' }}>Banner {index + 1}</div>

                            <div style={{ width: '100%', aspectRatio: '4/3', background: '#27272a', borderRadius: '8px', overflow: 'hidden', position: 'relative', marginBottom: '12px', border: '1px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {banner.image_url ? (
                                    <img src={banner.image_url} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon size={24} color="#52525b" />
                                )}
                                {uploading[`banner-${index}`] && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Loader2 size={20} className="animate-spin" color="#fff" />
                                    </div>
                                )}
                            </div>

                            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '12px' }}>
                                <button style={{ width: '100%', padding: '8px', background: '#3f3f46', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Upload Image</button>
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner', index)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                            </div>

                            <input
                                type="text"
                                value={banner.title}
                                onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                                style={{ ...inputStyle, marginBottom: '8px' }}
                                placeholder="Banner Title"
                            />
                            <input
                                type="text"
                                value={banner.link}
                                onChange={(e) => handleBannerChange(index, 'link', e.target.value)}
                                style={inputStyle}
                                placeholder="Link URL"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none'
};

const actionButtonStyle = {
    padding: '8px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '6px',
    color: '#a1a1aa',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default AdminShopHero;
