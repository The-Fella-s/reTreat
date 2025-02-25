const express = require('express');
const Cart = require('../models/Cart');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// router.use(authMiddleware);

// Middleware to validate item data
const validateItemData = (req, res, next) => {
    const { productId, name, quantity, price } = req.body;
    if (!productId || !name || !quantity || !price) {
        return res.status(400).json({ message: 'Missing required fields: productId, name, quantity, price' });
    }
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    next();
};

// Add item to cart
router.post('/', validateItemData, async (req, res) => {
    try {
        const { productId, name, quantity, price } = req.body;
        const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
        // actual user id needed

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, name, quantity, price });
        }

        // Update the total price
        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update item quantity in cart
router.put('/:itemId', validateItemData, async (req, res) => {
    try {
        const { quantity } = req.body;
        const userId = req.user.id;
        const itemId = req.params.itemId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;

        // Update the total price
        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Remove item from cart
router.delete('/:itemId', async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = req.params.itemId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        // Update the total price
        cart.total = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Retrieve cart
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;