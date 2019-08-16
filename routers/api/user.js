const express = require('express');
const userController = require('../../controllers/user');
const authenticate = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/users/test', userController.testUser);
router.get('/users/me', authenticate.requireUserLogin, userController.readCurrentUser);
router.post('/users', userController.createUser);
router.get('/users', userController.readUsers);
router.get('/users/:id', userController.readOneUser);
router.delete('/users/:id', userController.deleteUser);
router.patch('/users/:id', userController.updateUser);
router.post('/users/login', userController.loginUser);

module.exports = router;