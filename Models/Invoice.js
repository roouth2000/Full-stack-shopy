import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: Number,  // Filled from Product
});

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🧑‍💼 Link to user
  customerName: String,
  invoiceNumber: String,
  referenceNumber: String,
  invoiceDate: Date,
  dueDate: Date,
  paymentMethod: String,
  bank: String,
  notes: String,
  terms: String,
  items: [invoiceItemSchema],
  totalAmount: Number,
  pdfPath: String,
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
