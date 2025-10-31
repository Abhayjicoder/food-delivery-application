const Cart = require('../models/cart.model');
const Food = require('../models/food.model');

exports.addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const userId = req.user._id;

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Get food details
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        if (!food.price) {
            return res.status(400).json({
                success: false,
                message: 'Food item price is not set'
            });
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find(item => item.food.toString() === foodId);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.price = food.price; // Update price in case it changed
        } else {
            cart.items.push({
                food: foodId,
                quantity,
                price: food.price
            });
        }

        await cart.save();
        await cart.populate('items.food');

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.food');

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [], totalAmount: 0 }
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart'
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { foodId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.food');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart item'
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { foodId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.food.toString() !== foodId);
        await cart.save();
        await cart.populate('items.food');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart'
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            data: { items: [], totalAmount: 0 }
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
};
