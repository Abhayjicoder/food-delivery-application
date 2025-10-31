const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { addressId } = req.body;
        const userId = req.user._id;

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.food');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Calculate total amount
        const amount = cart.totalAmount;

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'inr',
            metadata: {
                userId: userId.toString(),
                cartId: cart._id.toString(),
                addressId: addressId
            }
        });

        res.status(200).json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret
            }
        });
    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent'
        });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { paymentIntentId, addressId } = req.body;
        const userId = req.user._id;

        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed'
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.food');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Create order
        const order = new Order({
            user: userId,
            foodPartner: cart.items[0].food.partner, // Assuming all items are from same partner
            items: cart.items.map(item => ({
                food: item.food._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.totalAmount,
            status: 'pending',
            paymentStatus: 'completed',
            paymentId: paymentIntentId,
            deliveryAddress: addressId
        });

        await order.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        console.error('Confirm order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm order'
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.food')
            .populate('foodPartner', 'name')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

exports.getPartnerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ foodPartner: req.user._id })
            .populate('items.food')
            .populate('user', 'name')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get partner orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate('items.food')
            .populate('foodPartner', 'name')
            .populate('user', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has permission to view this order
        if (order.user._id.toString() !== req.user._id.toString() &&
            order.foodPartner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order details'
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if food partner has permission
        if (order.foodPartner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
};