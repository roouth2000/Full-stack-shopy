import Invoice from "../Models/Invoice.js";
import Product from "../Models/Product.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// 📄 Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const {
      customerName,
      invoiceNumber,
      referenceNumber,
      invoiceDate,
      dueDate,
      paymentMethod,
      bank,
      notes,
      terms,
      items // [{ productId, quantity }]
    } = req.body;

    let totalAmount = 0;
    const populatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const price = product.price;
      const total = price * item.quantity;
      totalAmount += total;

      populatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        total,
      });
    }

    const invoice = new Invoice({
      user: req.user?._id || null,
      customerName,
      invoiceNumber,
      referenceNumber,
      invoiceDate,
      dueDate,
      paymentMethod,
      bank,
      notes,
      terms,
      items: populatedItems,
      totalAmount,
    });

    await invoice.save();

    // 📄 Generate PDF
    const pdfName = `invoice-${invoice._id}.pdf`;
    const pdfPath = path.join("uploads", pdfName);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Customer: ${customerName}`);
    doc.text(`Invoice #: ${invoiceNumber}`);
    doc.text(`Reference #: ${referenceNumber}`);
    doc.text(`Invoice Date: ${invoiceDate}`);
    doc.text(`Due Date: ${dueDate}`);
    doc.text(`Payment: ${paymentMethod} | Bank: ${bank}`).moveDown();

    doc.fontSize(14).text("Items:");
    for (let it of populatedItems) {
      const p = await Product.findById(it.product);
      doc.text(`${p.name} (x${it.quantity}) @ ₹${it.price} = ₹${it.total}`);
    }

    doc.moveDown();
    doc.fontSize(16).text(`Total: ₹${totalAmount}`, { align: "right" });
    doc.moveDown().fontSize(12).text(`Notes: ${notes}`).text(`Terms: ${terms}`);
    doc.end();

    invoice.pdfPath = pdfPath;
    await invoice.save();

    res.status(201).json({ message: "Invoice created", invoice, pdfUrl: `/${pdfPath}` });

  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

// 📄 Get All Invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get Single Invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("items.product");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ invoice, pdfUrl: `/${invoice.pdfPath}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Filter Invoices
export const filterInvoices = async (req, res) => {
  try {
    const { startDate, endDate, dueStart, dueEnd, paymentMethod } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.invoiceDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (dueStart && dueEnd) {
      query.dueDate = { $gte: new Date(dueStart), $lte: new Date(dueEnd) };
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const invoices = await Invoice.find(query).populate("items.product").sort({ createdAt: -1 });
    res.status(200).json({ invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Optional: Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice deleted", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
