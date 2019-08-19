const express = require('express');
const tagController = require('../../controllers/tag');
const { requireAdminLogin } = require('../../middleware/authenticate');

const router = new express.Router();

router.get('/tags/test', tagController.testTag);
router.post('/tags', requireAdminLogin, tagController.createTag);
router.get('/tags', tagController.readTags);
router.get('/tags/:id', tagController.readOneTag);
router.delete('/tags/:id', requireAdminLogin, tagController.deleteTag);
router.patch('/tags/:id', requireAdminLogin, tagController.updateTag);

module.exports = router;