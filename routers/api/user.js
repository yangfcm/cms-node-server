const express = require('express');
const adminController = require('../../controllers/user');

const router = new express.Router();

router.get('/users/test', adminController.testUser);

module.exports = router;