const User = require('../models/User');
const App = require('../models/App');
const {hash} = require('bcryptjs');

exports.postCart = async (req, res) => {
    const appId = req.body.appId;
    try {
        const app = await App.findById(appId);
        const user = await User.findById(req.userId);
        const cartAppIndex = await user.cart.apps.findIndex((cp) => {
            return cp.appId.toString() === app._id.toString();
        });
        const updatedCartApps = [...user.cart.apps];
        if (cartAppIndex < 0) {
            updatedCartApps.push({
                appId: app._id,
            });
        }
        else{
            return res.status(200).json({success: false, message:'App is already in cart'});
        }
        const updatedCart = { apps: updatedCartApps };
        user.cart = updatedCart;
        user.save();
        return res.status(200).json({success: true, message: 'Posted to cart'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

exports.deleteCartItem = async (req, res) => {
    const appId = req.body.appId;
    try {
        const user = await User.findById(req.userId);
        const updatedCartApps = user.cart.apps.filter((item) => {
            return item.appId.toString() !== appId.toString();
        });
        user.cart.apps = updatedCartApps;
        user.save();
        return res.status(200).json({success: true, message: 'Remove from cart'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

exports.updateUser = async (req, res) => {
    const newpass = req.body.newpass;
    const hashedNewPassword = await hash(newpass, 10);
    const user = await User.findById(req.userId);
    if(!user) return res.status(400).json({success:false, message: 'User not exist'});
    try {
        user.password = hashedNewPassword;
        user.save();
        return res.status(200).json({success: true, message: 'Password changed'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

exports.Cart = async (req, res) => {
    const user = await User.findById(req.userId);
    if(!user) return res.status(400).json({success:false, message: 'User not exist'});
    try {
        let apps = await (await user.populate('cart.apps.appId')).cart.apps
        return res.status(200).json({success: true, apps});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: 'Internal server error'});
    }
}