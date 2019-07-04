const express = require('express');
const tagController = require('../../controllers/tag');

const router = new express.Router();

router.get('/tags/test', tagController.testTag);

module.exports = router;