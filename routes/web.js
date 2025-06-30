import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/upload.js";
import { registerUser, registerUserpost, verifyUser, loginUser } from "../Controllers/AuthController.js";
import { UserProfile } from "../Controllers/ProfileController.js";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } from "../Controllers/ProductController.js";
import { createCategory, getAllCategories, getSingleCategory, updateCategory, deleteCategory } from "../Controllers/CategoryController.js";
import { createVendor, getAllVendors, getVendor, updateVendor, deleteVendor } from "../Controllers/vendorController.js";
import { createInvoice, getAllInvoices, getInvoiceById, filterInvoices, deleteInvoice } from "../Controllers/invoiceController.js";
import { createPurchase, getAllPurchases, getPurchaseById, deletePurchase } from "../Controllers/purchaseController.js";
import { getDailyPurchaseReport, getMonthlyPurchaseReport, getDailyInvoiceReport, getMonthlyInvoiceReport, getFilteredPurchases } from "../Controllers/reportController.js";
import { downloadDailyPurchasePDF, downloadMonthlyPurchasePDF } from "../Controllers/reportPdfController.js";

const router = express.Router();

// User Auth
router.post("/user/register", registerUser);
router.get("/user/register", registerUserpost);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/profile", isAuth, UserProfile);

// Product
router.post("/products", upload.single("image"), createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

// Category
router.post("/categories", upload.single("image"), createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getSingleCategory);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

// Vendor
router.post("/vendors", upload.single("logo"), createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getVendor);
router.put("/vendors/:id", upload.single("logo"), updateVendor);
router.delete("/vendors/:id", deleteVendor);

// Invoice
router.post("/invoices", createInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getInvoiceById);
router.get("/invoices/filter", filterInvoices);
router.delete("/invoices/:id", deleteInvoice);

// Purchase
router.post("/purchases", upload.single("shopImage"), createPurchase);
router.get("/purchases", getAllPurchases);
router.get("/purchases/:id", getPurchaseById);
router.delete("/purchases/:id", deletePurchase);

// Report
router.get("/reports/purchase/daily", getDailyPurchaseReport);
router.get("/reports/purchase/monthly", getMonthlyPurchaseReport);
router.get("/reports/invoice/daily", getDailyInvoiceReport);
router.get("/reports/invoice/monthly", getMonthlyInvoiceReport);
router.get("/reports/purchase/filter", getFilteredPurchases);

router.get("/reports/purchase/daily/download", downloadDailyPurchasePDF);
router.get("/reports/purchase/monthly/download", downloadMonthlyPurchasePDF);

export default router;
