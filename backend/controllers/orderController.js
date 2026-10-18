const mongoose = require('mongoose');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

// Puts stock back for items already deducted when an order fails part-way
const restoreStock = (items) =>
  Promise.all(items.map(({ medicine, quantity }) =>
    Medicine.updateOne({ _id: medicine }, { $inc: { stock: quantity } })
  ));

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.placeOrder = async (req, res) => {
  const { medicines, paymentMethod } = req.body;

  if (!Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ message: 'No medicines in order' });
  }

  const deducted = [];
  try {
    for (const item of medicines) {
      const quantity = Number(item.quantity);
      if (!mongoose.isValidObjectId(item.medicine) || !Number.isInteger(quantity) || quantity < 1) {
        throw { status: 400, message: 'Invalid medicine or quantity in order' };
      }

      // Atomically deduct stock only if enough is available
      const medicine = await Medicine.findOneAndUpdate(
        { _id: item.medicine, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );
      if (!medicine) {
        throw { status: 400, message: 'One or more medicines are unavailable or out of stock' };
      }

      // Price always comes from the database, never from the client
      deducted.push({ medicine: medicine._id, quantity, price: medicine.price });
    }

    const totalAmount = deducted.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const createdOrder = await Order.create({
      user: req.user._id,
      medicines: deducted,
      totalAmount,
      paymentMethod,
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    await restoreStock(deducted);
    res.status(error.status || 500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('medicines.medicine', 'name batchNo')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('medicines.medicine', 'name batchNo price');

    const isOwner = order && order.user && order.user._id.equals(req.user._id);
    if (!order || (!isOwner && req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
