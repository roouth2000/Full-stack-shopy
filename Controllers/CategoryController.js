import Category from "../Models/Category.js";

// CREATE Category with image
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file?.filename;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({ name, description, image });
        await category.save();

        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE Category with image
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const image = req.file?.filename;

        const updatedFields = {
            name,
            description,
        };
        if (image) updatedFields.image = image;

        const category = await Category.findByIdAndUpdate(id, updatedFields, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET All Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET Single Category
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  
