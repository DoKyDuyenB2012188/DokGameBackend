const express = require('express');
const {isAuth} = require('../middleware/isAuth');
const userController = require('../controllers/user');
const router = express.Router();

router.post('/addCart', isAuth, userController.postCart);
router.delete('/removeCart', isAuth, userController.deleteCartItem);
router.get('/cart', isAuth, userController.Cart);
router.put('/', isAuth, userController.updateUser);
module.exports = router;