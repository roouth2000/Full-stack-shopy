import Purchase from "../Models/Purchase.js";
import Invoice from "../Models/Invoice.js";

// Utility: Get Start and End of Day/Month
const getDateRange = (type) => {
    const now = new Date();
    let start, end;

    if (type === "daily") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
    } else if (type === "monthly") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { start, end };
};

// 📦 Daily Purchase Report
export const getDailyPurchaseReport = async (req, res) => {
    try {
        const { start, end } = getDateRange("daily");
        const purchases = await Purchase.find({
            createdAt: { $gte: start, $lte: end }
        }).populate("product");

        res.status(200).json({ date: start, count: purchases.length, purchases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📦 Monthly Purchase Report
export const getMonthlyPurchaseReport = async (req, res) => {
    try {
        const { start, end } = getDateRange("monthly");
        const purchases = await Purchase.find({
            createdAt: { $gte: start, $lte: end }
        }).populate("product");

        res.status(200).json({ month: start.toLocaleString('default', { month: 'long' }), count: purchases.length, purchases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧾 Daily Invoice Report
export const getDailyInvoiceReport = async (req, res) => {
    try {
        const { start, end } = getDateRange("daily");
        const invoices = await Invoice.find({
            createdAt: { $gte: start, $lte: end }
        }).populate("items.product");

        res.status(200).json({ date: start, count: invoices.length, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧾 Monthly Invoice Report
export const getMonthlyInvoiceReport = async (req, res) => {
    try {
        const { start, end } = getDateRange("monthly");
        const invoices = await Invoice.find({
            createdAt: { $gte: start, $lte: end }
        }).populate("items.product");

        res.status(200).json({ month: start.toLocaleString('default', { month: 'long' }), count: invoices.length, invoices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getFilteredPurchases = async (req, res) => {
    try {
        const {
            shopName,
            minAmount,
            maxAmount,
            status,
            paymentMethod,
            startDate,
            endDate,
        } = req.query;

        const filter = {};

        if (shopName) {
            filter.shopName = { $regex: new RegExp(shopName, "i") }; // case-insensitive
        }

        if (status) {
            filter.status = status;
        }

        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
        }

        if (startDate || endDate) {
            filter.purchaseDate = {};
            if (startDate) filter.purchaseDate.$gte = new Date(startDate);
            if (endDate) filter.purchaseDate.$lte = new Date(endDate);
        }

        const purchases = await Purchase.find(filter).sort({ purchaseDate: -1 }).populate("product");

        res.status(200).json({ total: purchases.length, purchases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};