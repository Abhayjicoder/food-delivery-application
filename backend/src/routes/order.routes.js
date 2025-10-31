const express = require('express');
const orderController = require('../controllers/order.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validation.middleware');
const { body, param } = require('express-validator');

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(authUserMiddleware);

// Place a new order (create payment intent first)
router.post('/create-payment-intent',
    [
        body('addressId').optional().isString().withMessage('Invalid address ID'),
    ],
    validateRequest,
    orderController.createPaymentIntent
);

// Confirm order after successful payment
router.post('/confirm',
    [
        body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
        body('addressId').optional().isString().withMessage('Invalid address ID')
    ],
    validateRequest,
    orderController.confirmOrder
);

// Get user's orders
router.get('/user', orderController.getUserOrders);

// Get food partner's orders
router.get('/partner', orderController.getPartnerOrders);

// Get specific order details
router.get('/:orderId',
    [
        param('orderId').isMongoId().withMessage('Invalid order ID')
    ],
    validateRequest,
    orderController.getOrderDetails
);

// Update order status (food partner only)
router.put('/:orderId/status',
    [
        param('orderId').isMongoId().withMessage('Invalid order ID'),
        body('status').isIn(['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
            .withMessage('Invalid status')
    ],
    validateRequest,
    orderController.updateOrderStatus
);

module.exports = router;