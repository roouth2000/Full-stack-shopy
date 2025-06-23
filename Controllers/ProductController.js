import Product from "../Models/Product.js";

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product" });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const image = req.file ? req.file.filename : null;

        const product = await Product.create({
            name,
            price,
            image,
            description,
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};                  