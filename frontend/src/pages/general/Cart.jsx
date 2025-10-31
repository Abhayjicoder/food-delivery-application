import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/cart.css';
import PaymentForm from '../../components/PaymentForm';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/cart', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setCart(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (foodId, quantity) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/update/${foodId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            if (data.success) {
                setCart(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    };

    const removeItem = async (foodId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/remove/${foodId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setCart(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to remove item');
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        try {
            const paymentResponse = await fetch('http://localhost:3000/api/orders/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ addressId: 'default' })
            });
            const paymentData = await paymentResponse.json();

            if (!paymentData.success || !paymentData.data?.clientSecret) {
                throw new Error(paymentData.message || 'Failed to start checkout');
            }

            setClientSecret(paymentData.data.clientSecret);
            setShowPaymentForm(true);
        } catch (err) {
            setError(err.message || 'Failed to process payment');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="cart-loading">Loading...</div>;
    }

    if (error) {
        return <div className="cart-error">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <div className="cart-empty">Your cart is empty</div>;
    }

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.food._id} className="cart-item">
                        <img src={item.food.image} alt={item.food.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.food.name}</h3>
                            <p className="cart-item-price">₹{item.price}</p>
                            <div className="cart-item-quantity">
                                <button
                                    onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="cart-item-remove"
                                onClick={() => removeItem(item.food._id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>₹{cart.totalAmount}</span>
                </div>
                {!showPaymentForm ? (
                    <button className="cart-checkout" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                ) : (
                    <div className="payment-form-container">
                        <h3>Enter Payment Details</h3>
                        {clientSecret && (
                            <PaymentForm 
                                clientSecret={clientSecret}
                                onSuccess={() => navigate('/orders')}
                                onError={(msg) => setError(msg)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;