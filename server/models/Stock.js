const mongoose = require('mongoose');

// Define the schema for stocks
const stockSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
   
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link the stock to a user
}, { timestamps: true });

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
