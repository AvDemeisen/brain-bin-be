const express = require('express');
const router = express.Router();

const thought_controller = require('../controllers/thoughts');

router.get('/', thought_controller.home);
router.get('/thoughts', thought_controller.thoughts);
router.get('/thoughts/:id', thought_controller.thought_by_id);
module.exports = router;