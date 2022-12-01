const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');

// @route GET api/store/
// @desc Get all apps
// @access Public
router.get('/', storeController.getApps);
// @route GET api/store/:appId
// @desc get app by appId
// @access Public
router.get('/:appId', storeController.getApp);// detail app
// @route GET api/store/filter/
// @desc get filter app by filter keys
// @access Public
router.get('/filter/:filter', storeController.getFilter);
router.get('/best/:filter', storeController.getFilter);
module.exports = router;