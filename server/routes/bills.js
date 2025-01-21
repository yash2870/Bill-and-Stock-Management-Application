const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill"); // Mongoose model for bills
const Stock = require("../models/Stock"); // Mongoose model for stock
const User = require("../models/User"); // Mongoose model for users
const { verifyToken } = require('../middlewares/authenticateToken'); // Custom middleware to verify JWT token
// Generate Bill Endpoint
router.post("/generate-bill", verifyToken, async (req, res) => {
    try {
      const { customerName, customerContact, businessGST, products, originalSubtotal,discount, subtotal, gst, grandTotal } = req.body;
  
      // Deduct quantities from stock
      for (const product of products) {
        const stockItem = await Stock.findOne({ productName: product.name });
  
        if (stockItem && stockItem.quantity >= product.quantity) {
          stockItem.quantity -= product.quantity; // Deduct quantity
          await stockItem.save();
        } else {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
      }
  
      // Create a new bill
      const bill = new Bill({
        userId: req.userId, // From the token
        customerName,
        customerContact,
        businessGST,
        products,
        originalSubtotal,
        discount,
        subtotal,
        gst,
        grandTotal,
        createdAt: new Date(),
      });
  
      await bill.save();
  
      res.status(200).json({ message: "Bill generated successfully!", bill });
    } catch (error) {
      console.error("Error generating bill:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  router.get("/view-bills", verifyToken, async (req, res) => {
    try {
      // Fetch all bills associated with the authenticated user
      const bills = await Bill.find({ userId: req.userId }).populate("userId", "name email");
  
      if (bills.length === 0) {
        return res.status(404).json({ message: "No bills found." });
      }
  
      res.status(200).json({ bills });
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Internal Server Error" });
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
 
