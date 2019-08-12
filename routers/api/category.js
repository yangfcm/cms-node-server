const express = require('express');
const categoryController = require('../../controllers/category');

const router = new express.Router();

router.get('/categories/test', categoryController.testCategory);
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.readCategories);
router.get('/categories/:id', categoryController.readOneCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.patch('/categories/:id', categoryController.updateCategory);

module.exports = router;