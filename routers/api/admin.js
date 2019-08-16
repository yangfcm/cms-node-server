const express = require('express');
const adminController = require('../../controllers/admin');
const authenticate = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/admins/test', adminController.testAdmin);
router.get('/admins/me', authenticate.requireAdminLogin, adminController.readCurrentAdmin);
router.post('/admins', authenticate.requireAdminLogin, adminController.createAdmin);
router.get('/admins', authenticate.requireAdminLogin, adminController.readAdmins);
router.get('/admins/:id', authenticate.requireAdminLogin, adminController.readOneAdmin);
router.delete('/admins/:id', authenticate.requireAdminLogin, adminController.deleteAdmin);
router.patch('/admins/:id', authenticate.requireAdminLogin, adminController.updateAdmin);
router.post('/admins/login', adminController.loginAdmin);
router.post('/admins/logout', authenticate.requireAdminLogin, adminController.logoutAdmin);

module.exports = router;