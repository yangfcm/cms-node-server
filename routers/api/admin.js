const express = require('express');
const adminController = require('../../controllers/admin');

const router = new express.Router();

router.get('/admins/test', adminController.testAdmin);

module.exports = router;