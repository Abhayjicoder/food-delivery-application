import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';

const CreateFood = () => {
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ videoFile, setVideoFile ] = useState(null);
    const [ videoURL, setVideoURL ] = useState('');
    const [ fileError, setFileError ] = useState('');
    const [ posts, setPosts ] = useState([]);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }
        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);
        return () => URL.revokeObjectURL(url);
    }, [ videoFile ]);

    // fetch partner's existing posts
    useEffect(() => {
        fetchPartnerPosts();
    }, []);

    async function fetchPartnerPosts(){
        try{
            const res = await axios.get('http://localhost:3000/api/food/partner', { withCredentials: true });
            setPosts(res.data.foods || []);
        }catch(err){
            setPosts([]);
            // show helpful toast when fetch fails (likely not authenticated as partner)
            setToast({ message: 'Unable to load your posts. Make sure you are logged in as a food partner.', type: 'error' });
        }
    }

    const [ toast, setToast ] = useState({ message: '', type: 'info' });

    async function deletePost(id){
        const ok = window.confirm('Delete this post? This action cannot be undone.');
        if(!ok) return;
        try{
            await axios.delete(`http://localhost:3000/api/food/${id}`, { withCredentials: true });
            setPosts(prev => prev.filter(p => p._id !== id));
            setToast({ message: 'Post deleted', type: 'success' });
        }catch(err){
            console.error('Delete failed', err);
            setToast({ message: 'Failed to delete the post', type: 'error' });
        }
    }

    // Editing existing post
    const [ editingId, setEditingId ] = useState(null);
    const [ editName, setEditName ] = useState('');
    const [ editDescription, setEditDescription ] = useState('');
    const [ editPrice, setEditPrice ] = useState('');

    function startEdit(p){
        setEditingId(p._id);
        setEditName(p.name || '');
        setEditDescription(p.description || '');
        setEditPrice(p.price?.toString() || '');
    }

    async function saveEdit(id){
        try{
            if (!editPrice || isNaN(parseFloat(editPrice)) || parseFloat(editPrice) <= 0) {
                setToast({ message: 'Please enter a valid price', type: 'error' });
                return;
            }

            const res = await axios.patch(
                `http://localhost:3000/api/food/${id}`, 
                { 
                    name: editName, 
                    description: editDescription,
                    price: parseFloat(editPrice)
                }, 
                { withCredentials: true }
            );
            setPosts(prev => prev.map(p => p._id === id ? (res.data.food || { 
                ...p, 
                name: editName, 
                description: editDescription,
                price: parseFloat(editPrice)
            }) : p));
            setEditingId(null);
            setToast({ message: 'Post updated', type: 'success' });
        }catch(err){
            console.error('Update failed', err);
            setToast({ message: 'Failed to update post', type: 'error' });
        }
    }

    function cancelEdit(){ setEditingId(null); setEditName(''); setEditDescription(''); setEditPrice(''); }

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[ 0 ];
        if (!file) { setVideoFile(null); setFileError(''); return; }
        if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[ 0 ];
        if (!file) { return; }
        if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setToast({ message: 'Please enter a valid price', type: 'error' });
            return;
        }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append("video", videoFile);

        const response = await axios.post("http://localhost:3000/api/food", formData, {
            withCredentials: true,
        })

        console.log(response.data);
        // reset form and refresh the partner's posts list
        setName(''); setDescription(''); setPrice(''); setVideoFile(null);
        // if backend returned the created food, add it locally so it's visible immediately
        if (response.data && response.data.food) {
            setPosts(prev => [response.data.food, ...prev]);
        }
        await fetchPartnerPosts();
        setToast({ message: 'Post created', type: 'success' });
    };

    const isDisabled = useMemo(() => !name.trim() || !videoFile || !price, [ name, videoFile, price ]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Video</label>
                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                        />

                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="file-dropzone-inner">
                                <svg className="file-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" />
                                </svg>
                                <div className="file-dropzone-text">
                                    <strong>Tap to upload</strong> or drag and drop
                                </div>
                                <div className="file-hint">MP4, WebM, MOV • Up to ~100MB</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text" role="alert">{fileError}</p>}

                        {videoFile && (
                            <div className="file-chip" aria-live="polite">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" />
                                </svg>
                                <span className="file-chip-name">{videoFile.name}</span>
                                <span className="file-chip-size">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>
                                <div className="file-chip-actions">
                                    <button type="button" className="btn-ghost" onClick={openFileDialog}>Change</button>
                                    <button type="button" className="btn-ghost danger" onClick={() => { setVideoFile(null); setFileError(''); }}>Remove</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {videoURL && (
                        <div className="video-preview">
                            <video className="video-preview-el" src={videoURL} controls playsInline preload="metadata" />
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="foodName">Name</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodDesc">Description</label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            placeholder="Write a short description: ingredients, taste, spice level, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodPrice">Price (₹)</label>
                        <input
                            id="foodPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g., 199.99"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            Save Food
                        </button>
                    </div>
                </form>
                {/* Partner Dashboard: existing posts with delete/edit actions */}
                <section className="partner-posts" style={{ marginTop: 20 }}>
                    <h3>Partner dashboard</h3>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 6 }}>You have created <strong style={{ color: 'var(--color-accent)' }}>{posts.length}</strong> post{posts.length !== 1 ? 's' : ''} till date.</div>
                    {posts.length === 0 ? (
                        <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>No posts yet.</div>
                    ) : (
                        <div className="saved-collage" role="list">
                            {posts.map((p) => (
                                <div key={p._id} className="collage-item" style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%' }}>
                                        <video src={p.video} style={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 6 }} muted playsInline />
                                        <div style={{ flex: 1 }}>
                                            {editingId === p._id ? (
                                            <div>
                                                <input 
                                                    value={editName} 
                                                    onChange={(e) => setEditName(e.target.value)} 
                                                    placeholder="Food name"
                                                    style={{ width: '100%', marginBottom: 6, padding: 6, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface-alt)', color: 'var(--color-text)' }} 
                                                />
                                                <textarea 
                                                    value={editDescription} 
                                                    onChange={(e) => setEditDescription(e.target.value)} 
                                                    placeholder="Description"
                                                    rows={2} 
                                                    style={{ width: '100%', marginBottom: 6, padding: 6, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface-alt)', color: 'var(--color-text)' }} 
                                                />
                                                <input 
                                                    type="number"
                                                    value={editPrice} 
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    placeholder="Price (₹)"
                                                    min="0"
                                                    step="0.01"
                                                    style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface-alt)', color: 'var(--color-text)' }} 
                                                />
                                            </div>
                                            ) : (
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.description}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--color-accent)', marginTop: 4 }}>
                                                        ₹{p.price || 'Price not set'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        {editingId === p._id ? (
                                            <>
                                                <button className="btn-ghost" onClick={() => saveEdit(p._id)}>Save</button>
                                                <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn-ghost" onClick={() => startEdit(p)}>Edit</button>
                                                <button className="btn-ghost danger" onClick={() => deletePost(p._id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
        </div>
    );
};

export default CreateFood;