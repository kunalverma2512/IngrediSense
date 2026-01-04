import express from 'express';
const router = express.Router();
import ingredientController from '../controllers/ingredient.controller.js';

// GET /api/ingredients - Get all ingredients
router.get('/', ingredientController.getAllIngredients);

// POST /api/ingredients/analyze - Analyze ingredient
router.post('/analyze', ingredientController.analyzeIngredient);

// POST /api/ingredients/scan - Scan product (OCR/image upload)
router.post('/scan', ingredientController.scanProduct);

// GET /api/ingredients/:id - Get ingredient by ID
router.get('/:id', ingredientController.getIngredientById);

export default router;
