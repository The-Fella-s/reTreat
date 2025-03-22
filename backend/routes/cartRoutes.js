const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Added to cast to ObjectId
const Cart = require('../models/Cart');
const User = require('../models/User');
const Services = require('../models/Services');

// GET route to fetch the cart by userId
router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await Cart.findOne({ user: userId }).populate('items.service');
      console.log('Cart items:', cart.items); // Debug log
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// POST route to add a service to the cart
router.post('/add/service', async (req, res) => {
  try {
    const { email, serviceName, quantity } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided email.' });
    }
    if (!serviceName) {
      return res.status(400).json({ message: 'Service name is required to verify catalog details.' });
    }
    const service = await Services.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found in database.' });
    }
    // Explicitly cast service._id to an ObjectId
    const serviceId = mongoose.Types.ObjectId(service._id);
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.service.toString() === serviceId.toString());
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ service: serviceId, quantity });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding service to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST route to set or update the menu (only one allowed)
router.post('/add/menu', async (req, res) => {
  try {
    const { userId, menuServiceId } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }
    cart.menu = menuServiceId;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE route to remove a service from the cart
router.delete('/remove/service/:userId/:serviceId', async (req, res) => {
  try {
    const { userId, serviceId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.service.toString() !== serviceId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE route to remove the menu from the cart
router.delete('/remove/menu/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.menu = null;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
