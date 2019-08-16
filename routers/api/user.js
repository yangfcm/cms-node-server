const express = require('express');
const userController = require('../../controllers/user');
const authenticate = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/users/test', userController.testUser);
router.get('/users/me', authenticate.requireUserLogin, userController.readCurrentUser);
router.post('/users', userController.createUser);
router.get('/users', authenticate.requireAdminLogin, userController.readUsers);
router.get('/users/:id', authenticate.requireUserLogin, userController.readOneUser);
router.delete('/users/:id', authenticate.requireAdminLogin, userController.deleteUser);
router.patch('/users/:id', authenticate.requireAdminLogin, userController.updateUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', authenticate.requireUserLogin, userController.logoutUser);

module.exports = router;