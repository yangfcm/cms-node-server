const express = require('express');
const tagController = require('../../controllers/tag');

const router = new express.Router();

router.get('/tags/test', tagController.testTag);
router.post('/tags', tagController.createTag);
router.get('/tags', tagController.readTags);
router.get('/tag/:id', tagController.readOneTag);
router.delete('/tags/:id', tagController.deleteTag);
router.patch('/tags/:id', tagController.updateTag);

module.exports = router;