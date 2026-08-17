const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new AppError("Category already exists", 400);
  }

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    count: categories.length,
    categories,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category updated successfully",
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};