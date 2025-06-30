import Invoice from "../Models/Invoice.js";

export const filterInvoices = async (req, res) => {
  try {
    const { startDate, endDate, dueStart, dueEnd, paymentMethod } = req.query;

    const query = {};

    // 📅 Filter by invoiceDate range
    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 📅 Filter by dueDate range
    if (dueStart && dueEnd) {
      query.dueDate = {
        $gte: new Date(dueStart),
        $lte: new Date(dueEnd),
      };
    }

    // 💳 Filter by paymentMethod
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // 🧑 Optional: filter only logged-in user's invoices
    // query.user = req.user._id;

    const invoices = await Invoice.find(query).populate("items.product").sort({ createdAt: -1 });
    res.status(200).json({ invoices });

  } catch (error) {
    res.status(500).json({ message: "Filter failed", error: error.message });
  }
};
