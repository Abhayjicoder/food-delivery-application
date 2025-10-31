import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import Toast from '../../components/Toast'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ toast, setToast ] = useState({ message: '', type: 'info' })
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount || 0) + 1, _liked: true } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount || 1) - 1), _liked: false } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount || 0) + 1, _saved: true } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount || 1) - 1), _saved: false } : v))
        }
    }

    async function addToCart(item) {
        try {
            if (!item.price) {
                console.error("This item doesn't have a price set");
                setToast({ message: 'This item is missing a price', type: 'error' })
                return;
            }
            
            const response = await axios.post(
                "http://localhost:3000/api/cart/add",
                {
                    foodId: item._id,
                    quantity: 1
                },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                console.log("Added to cart");
                setToast({ message: 'Added to cart', type: 'success' })
            }
        } catch (error) {
            console.error("Failed to add to cart:", error.response?.data?.message || error.message);
            setToast({ message: error.response?.data?.message || 'Failed to add to cart', type: 'error' })
        }
    }

    return (
        <>
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                onAddToCart={addToCart}
                emptyMessage="No videos available."
            />
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: 'info' })}
                duration={2500}
            />
        </>
    )
}

export default Home