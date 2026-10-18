const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get all valid user IDs to filter out orphaned orders
    const users = await User.find({ role: 'user' }).select('_id');
    const userIds = users.map(u => u._id);

    // 1. Calculate Monthly Revenue (Last 30 Days) - Filtered by active users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyOrders = await Order.find({ 
      createdAt: { $gte: thirtyDaysAgo },
      user: { $in: userIds }
    });
    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    // 2. Total Sales Count (All time) - Filtered by active users
    const totalSalesCount = await Order.countDocuments({ user: { $in: userIds } });
    
    const totalSalesAmountResult = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } }
    ]);
    const totalSalesAmount = totalSalesAmountResult.length > 0 ? totalSalesAmountResult[0].totalAmount : 0;

    // 3. Low Stock Alerts (Stock <= 20)
    const lowStockMedicines = await Medicine.find({ stock: { $lte: 20 } }).select('name batchNo stock price');

    // 4. Near Expiry Alerts (Expiry Date <= 30 Days from now or already expired)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringMedicines = await Medicine.find({ expiryDate: { $lte: thirtyDaysFromNow } })
      .select('name batchNo expiryDate stock');

    res.json({
      monthlyRevenue,
      totalSalesCount,
      totalSalesAmount,
      lowStockCount: lowStockMedicines.length,
      expiringCount: expiringMedicines.length,
      lowStockMedicines,
      expiringMedicines,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    const { batchNo, nearExpiry } = req.query;
    
    let query = {};
    
    if (batchNo) {
      // Escape regex special characters so user input is matched literally
      const escaped = String(batchNo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.batchNo = { $regex: escaped, $options: 'i' };
    }

    if (nearExpiry === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      query.expiryDate = { $lte: thirtyDaysFromNow };
    }

    const medicines = await Medicine.find(query).sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
