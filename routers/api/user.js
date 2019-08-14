const express = require('express');
const userController = require('../../controllers/user');

const router = new express.Router();

router.get('/users/test', userController.testUser);
router.post('/users', userController.createUser);
router.get('/users', userController.readUsers);
router.get('/users/:id', userController.readOneUser);
router.delete('/users/:id', userController.deleteUser);
router.patch('/users/:id', userController.updateUser);

module.exports = router;