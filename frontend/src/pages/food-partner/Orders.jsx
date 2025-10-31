import React, { useState, useEffect } from 'react';
import '../../styles/orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/orders/partner', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: status } : order
                ));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update order status');
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'confirmed': return '#17a2b8';
            case 'preparing': return '#007bff';
            case 'ready': return '#28a745';
            case 'delivered': return '#6c757d';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return <div className="orders-loading">Loading...</div>;
    }

    if (error) {
        return <div className="orders-error">{error}</div>;
    }

    if (orders.length === 0) {
        return <div className="orders-empty">No orders found</div>;
    }

    return (
        <div className="orders-container">
            <h2>Manage Orders</h2>
            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h3>Order #{order._id.slice(-6)}</h3>
                            <span className="order-time">
                                {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="order-customer">
                            <strong>Customer:</strong> {order.user.name}
                        </div>
                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>{item.quantity}x {item.food.name}</span>
                                    <span>₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-total">
                            <strong>Total:</strong> ₹{order.totalAmount}
                        </div>
                        <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                            {order.status}
                        </div>
                        <div className="order-actions">
                            {order.status === 'pending' && (
                                <>
                                    <button
                                        className="btn-confirm"
                                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                    >
                                        Confirm Order
                                    </button>
                                    <button
                                        className="btn-cancel"
                                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                    >
                                        Cancel Order
                                    </button>
                                </>
                            )}
                            {order.status === 'confirmed' && (
                                <button
                                    className="btn-prepare"
                                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                                >
                                    Start Preparing
                                </button>
                            )}
                            {order.status === 'preparing' && (
                                <button
                                    className="btn-ready"
                                    onClick={() => updateOrderStatus(order._id, 'ready')}
                                >
                                    Mark as Ready
                                </button>
                            )}
                            {order.status === 'ready' && (
                                <button
                                    className="btn-deliver"
                                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                                >
                                    Mark as Delivered
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;