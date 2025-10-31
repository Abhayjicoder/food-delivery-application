const express = require('express');
const cartController = require('../controllers/cart.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { body, param } = require('express-validator');

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(authUserMiddleware);

// Add item to cart
router.post('/add',
    [
        body('foodId').isMongoId().withMessage('Invalid food ID'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    validateRequest,
    cartController.addToCart
);

// Get cart contents
router.get('/', cartController.getCart);

// Update cart item quantity
router.put('/update/:foodId',
    [
        param('foodId').isMongoId().withMessage('Invalid food ID'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    validateRequest,
    cartController.updateCartItem
);

// Remove item from cart
router.delete('/remove/:foodId',
    [
        param('foodId').isMongoId().withMessage('Invalid food ID')
    ],
    validateRequest,
    cartController.removeFromCart
);

// Clear cart
router.delete('/clear', cartController.clearCart);

module.exports = router;
