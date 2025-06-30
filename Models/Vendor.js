import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  logo: {
    type: String, // image filename
    default: "",
  },
}, { timestamps: true });

export default mongoose.model("Vendor", vendorSchema);
