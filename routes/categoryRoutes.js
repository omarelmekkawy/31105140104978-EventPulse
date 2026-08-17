const express = require("express");
const { body, param } = require("express-validator");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required"),

    body("description")
      .optional()
      .trim(),
  ],
  validateRequest,
  createCategory
);

router.get(
  "/",
  getAllCategories
);

router.get(
  "/:id",
  getCategoryById
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  [
    param("id")
      .isMongoId()
      .withMessage("Category ID must be valid"),

    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category name cannot be empty"),

    body("description")
      .optional()
      .trim(),
  ],
  validateRequest,
  updateCategory
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteCategory
);

module.exports = router;