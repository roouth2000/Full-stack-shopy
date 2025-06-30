import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    shopImage: { type: String }, // path to uploaded image
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    purchaseDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Paid", "Unpaid", "Pending"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Google Pay", "Paytm", "PhonePe", "WhatsApp Pay", "Others"],
        required: true
    },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
