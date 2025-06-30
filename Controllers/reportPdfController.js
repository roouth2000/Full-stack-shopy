import PDFDocument from "pdfkit";
import Purchase from "../Models/Purchase.js";

export const downloadDailyPurchasePDF = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const purchases = await Purchase.find({
      purchaseDate: { $gte: start, $lte: end },
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=daily-report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Daily Purchase Report", { align: "center" });
    doc.moveDown();

    purchases.forEach((item, index) => {
      doc.fontSize(12).text(`${index + 1}. Shop: ${item.shopName}`);
      doc.text(`   Product: ${item.product}`);
      doc.text(`   Amount: ₹${item.amount}`);
      doc.text(`   Payment: ${item.paymentMethod}`);
      doc.text(`   Status: ${item.status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

export const downloadMonthlyPurchasePDF = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const purchases = await Purchase.find({
      purchaseDate: { $gte: start, $lte: end },
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=monthly-report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text("Monthly Purchase Report", { align: "center" });
    doc.moveDown();

    purchases.forEach((item, index) => {
      doc.fontSize(12).text(`${index + 1}. Shop: ${item.shopName}`);
      doc.text(`   Product: ${item.product}`);
      doc.text(`   Amount: ₹${item.amount}`);
      doc.text(`   Payment: ${item.paymentMethod}`);
      doc.text(`   Status: ${item.status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};
