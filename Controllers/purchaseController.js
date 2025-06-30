import Purchase from "../Models/Purchase.js";

// Create Purchase
export const createPurchase = async (req, res) => {
  try {
    const { shopName, product, amount, status, paymentMethod, notes, purchaseDate } = req.body;
    const shopImage = req.file?.filename;

    const purchase = new Purchase({
      shopName,
      product,
      amount,
      status,
      paymentMethod,
      notes,
      purchaseDate,
      shopImage
    });

    await purchase.save();
    res.status(201).json({ message: "Purchase created successfully", purchase });

  } catch (error) {
    res.status(500).json({ message: "Failed to create purchase", error: error.message });
  }
};

// Get All Purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("product").sort({ createdAt: -1 });
    res.status(200).json({ purchases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Purchase
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate("product");
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json({ purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Purchase
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json({ message: "Purchase deleted", purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
