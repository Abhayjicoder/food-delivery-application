import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../styles/reels.css'
import Logo from '../../components/Logo'
import axios from 'axios'

const Saved = () => {
    const [videos, setVideos] = useState([])
        const navigate = useNavigate()
        const location = useLocation()

    useEffect(() => {
        axios.get('http://localhost:3000/api/food/save', { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
            .catch(() => setVideos([]))
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post('http://localhost:3000/api/food/save', { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.filter(v => v._id !== item._id))
        } catch {
            // noop
        }
    }

    // Collage helpers
    const maxPreview = 6
        const preview = videos.slice(0, maxPreview)
    const remaining = Math.max(0, videos.length - preview.length)

    return (
        <div className="reels-page saved-page">
            <Logo position="top-left" />
            <div className="saved-header">
                <h2>Saved Reels</h2>
                <div className="saved-count">{videos.length} saved</div>
            </div>

            {videos.length === 0 ? (
                <div className="empty-state">No saved videos yet.</div>
            ) : (
                        <div className="saved-collage" role="list">
                            {preview.map((v, i) => (
                                <button
                                    key={v._id}
                                    className={`collage-item item-${i + 1}`}
                                    onClick={() => { /* optionally open reel detail or play */ }}
                                    aria-label={`Open saved reel ${i + 1}`}
                                >
                                    <video
                                        src={v.video}
                                        className="collage-thumb"
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onMouseEnter={(e) => { try { e.currentTarget.play() } catch {} }}
                                        onMouseLeave={(e) => { try { e.currentTarget.pause(); e.currentTarget.currentTime = 0 } catch {} }}
                                    />

                                    <div className="collage-overlay">
                                        <button
                                            className={`collage-like ${v._liked ? 'is-liked' : ''}`}
                                            onClick={(ev) => {
                                                ev.stopPropagation()
                                                // optimistic toggle like locally
                                                setVideos(prev => prev.map(p => p._id === v._id ? ({ ...p, _liked: !p._liked, likeCount: (p._liked ? Math.max(0, (p.likeCount ?? 1) - 1) : (p.likeCount ?? 0) + 1) }) : p))
                                                // optional: call backend like endpoint
                                                // axios.post('/api/food/like', { foodId: v._id }, { withCredentials: true }).catch(()=>{})
                                            }}
                                            aria-pressed={!!v._liked}
                                            title={v._liked ? 'Unlike' : 'Like'}
                                        >
                                            {/* heart icon */}
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                            </svg>
                                        </button>

                                        <div className="collage-like-count">{v.likeCount ?? 0}</div>
                                    </div>

                                    {i === preview.length - 1 && remaining > 0 && (
                                        <div className="more-overlay">+{remaining}</div>
                                    )}
                                </button>
                            ))}
                        </div>
            )}

            <div className="saved-actions">
                <button className="clear-btn" onClick={() => setVideos([])}>Clear All</button>
            </div>

            {/* Floating button to open Reels section - hidden when already on /reels */}
            {location.pathname !== '/reels' && (
                <button
                    className="open-reels-btn"
                    title="Open Reels"
                    onClick={() => navigate('/reels')}
                    aria-label="Open Reels"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z" />
                        <path d="M10 8v8l6-4-6-4z" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default Saved
