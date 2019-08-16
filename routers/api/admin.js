const express = require('express');
const adminController = require('../../controllers/admin');

const router = new express.Router();

router.get('/admins/test', adminController.testAdmin);
router.post('/admins', adminController.createAdmin);
router.get('/admins', adminController.readAdmins);
router.get('/admins/:id', adminController.readOneAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);
router.patch('/admins/:id', adminController.updateAdmin);
router.post('/admins/login', adminController.loginAdmin);

module.exports = router;