import Product from "../Models/Product.js";

// CREATE Product
export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const image = req.file?.filename;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and Price are required" });
        }

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            image,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product Created Successfully", product: newProduct });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GET All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 }); // newest first
        res.status(200).json({ products });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GET Single Product
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error("Fetch Product Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category } = req.body;
        const image = req.file?.filename;

        if (!name || !price) {
            return res.status(400).json({ message: "Name and Price are required" });
        }

        const updateFields = {
            name,
            price,
            description,
            category,
            image,
        };

        if (image) updateFields.image = image;

        const product = await Product.findByIdAndUpdate(id, updateFields);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product Updated Successfully", product });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product Deleted Successfully", product });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};  