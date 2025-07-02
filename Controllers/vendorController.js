import Invoice from "../Models/Invoice.js";
import Product from "../Models/Product.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// 📄 Create Invoice
export const createVendor = async (req, res) => {
  try {
    const { name, email, phone, address, city, state, zip, country } = req.body;

    const vendor = new Vendor({
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      country,
    });

    await vendor.save();

    res.status(201).json({ message: "Vendor created", vendor });
  } catch (error) {
    res.status(500).json({ message: "Error creating vendor", error: error.message });
    console.log(error);
  }
};

// 📄 Get All Vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json({ vendors });
    console.log(vendors);
  }
  catch (error) {
    res.status(500).json({ message: "Error getting vendors", error: error.message });
  }
};

// 📄 Get Single Vendor
export const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ vendor });
  }
  catch (error) {
    res.status(500).json({ message: "Error getting vendor", error: error.message });
  }
};

// 📄 Update Vendor
export const updateVendor = async (req, res) => {
  try {
    const { name, email, phone, address, city, state, zip, country } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(req.params.id, {
      name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      country,
    });

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor updated", vendor });
    console.log(vendor);
  }
  catch (error) {
    res.status(500).json({ message: "Error updating vendor", error: error.message });
  }
};

// 🗑️ Optional: Delete Vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted", vendor });
  }
  catch (error) {
    res.status(500).json({ message: "Error deleting vendor", error: error.message });
  }
};

