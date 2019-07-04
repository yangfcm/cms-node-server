const express = require('express');
const CategoryController = require('../../controllers/category');

const router = new express.Router();

router.get('/categories/test', CategoryController.testCategory);

module.exports = router;