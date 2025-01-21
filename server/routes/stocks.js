const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { verifyToken } = require('../middlewares/authenticateToken'); // Custom middleware to verify JWT token

// Add a new stock item
router.post('/add', verifyToken, async (req, res) => {
  const { productName, quantity, price } = req.body;
  const userId = req.userId; // The user's ID will be decoded from the token

  try {
    const newStockItem = new Stock({
      productName,
      quantity,
      price,
      userId
    });

    await newStockItem.save();
    res.status(201).json({ message: 'Stock item added successfully', newStockItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding stock' });
  }
});

// Get a specific stock item by productName and id
router.get('/view/:productName/', verifyToken, async (req, res) => {
  const { productName } = req.params;
  const userId = req.userId;  // The user's ID will be decoded from the token

  try {
    const stock = await Stock.findOne({ userId, productName,  }).exec();
    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }
    res.status(200).json({ stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching stock' });
  }
});

// Get all stock items for a user
// router.get('/view', verifyToken, async (req, res) => {
//   const userId = req.userId; // The user's ID will be decoded from the token

//   try {
//     const stocks = await Stock.find({ userId }).exec();
//     res.status(200).json({ stocks });
//     //console.log('Fetched Stocks:', stocks); // Debug log

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error while fetching stocks' });
//   }
// });

// Get all stock items for a user
router.get('/view', verifyToken, async (req, res) => {
  const userId = req.userId; // The user's ID will be decoded from the token

  try {
    const stocks = await Stock.find({ userId }).select('productName quantity price createdAt updatedAt').exec();
    res.status(200).json({ stocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching stocks' });
  }
});




// Update stock details
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { productName, quantity, price } = req.body;

  try {
    const stock = await Stock.findById(id);

    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    stock.productName = productName || stock.productName;
    stock.quantity = quantity || stock.quantity;
    stock.price = price || stock.price;

    const updatedStockItem = await stock.save();
    res.json({ message: 'Stock updated successfully', updatedStockItem });
  } catch (error) {
    console.error('Error updating stock item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete stock item
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: 'Stock item not found.' });
    }

    // Delete the stock item
    await stock.deleteOne();  // Use deleteOne() instead of remove()

    return res.status(200).json({
      message: 'Stock deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting stock item', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get("/view-stocks", verifyToken, async (req, res) => {
  try {
    // Fetch all stock items associated with the authenticated user, populating the user data
    const stocks = await Stock.find({ userId: req.userId }).populate("userId", "businessName");

    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stocks found." });
    }

    res.status(200).json({ stocks });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
