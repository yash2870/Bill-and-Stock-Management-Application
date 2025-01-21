const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: String,
  customerContact: String,
  businessGST: String,
  products: [
    {
      name: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  originalSubtotal:Number,
  subtotal: Number,
  discount: Number,
  gst: Number,
  grandTotal: Number,
  dateCreated: { type: Date, default: Date.now },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
