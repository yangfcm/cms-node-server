const express = require('express');
const categoryController = require('../../controllers/category');
const { requireAdminLogin } = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/categories/test', categoryController.testCategory);
router.post('/categories', requireAdminLogin, categoryController.createCategory);
router.get('/categories', categoryController.readCategories);
router.get('/categories/:id', categoryController.readOneCategory);
router.delete('/categories/:id', requireAdminLogin, categoryController.deleteCategory);
router.patch('/categories/:id', requireAdminLogin, categoryController.updateCategory);

module.exports = router;