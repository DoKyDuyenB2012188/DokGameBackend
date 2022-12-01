const {verify} = require('jsonwebtoken');
const {hash, compare} = require('bcryptjs');
const express = require('express');
const {createAccessToken , createRefreshToken, sendAccessToken, sendRefreshToken} = require('../tokens');
const User = require('../models/User')
const {isAuth} = require('../middleware/isAuth');
const router = express.Router();

//1. Register a users
router.post('/register',async (req, res) => {
    const {username, password} = req.body;
    if(!username || !password) return res.status(400).json({success: false, message: "missing username and/or password"});
    try {
        //1. check if user exist
        const user = await User.findOne({username});
        if(user) return res.status(400).json({success: false, message: "Username already taken"});
        //2. if not user exist, hash the password
        const hashedPassword = await hash(password, 10);
        //3. insert user in database
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({success: true, message: 'User created successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
})
//2. Login a user
router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    if(!username || !password) return res.status(400).json({success: false, message: "missing username and/or password"});
    try {
        const user = await User.findOne({username: username});
        if(!user) return res.status(400).json({success: false, message: 'Incorrect username or password'});
        const passedValid = await compare(password, user.password);
        if(!passedValid) return res.status(400).json({success: false, message: 'Incorrect username or password'});
        const accessToken = await createAccessToken(user._id);
        const refreshToken = await createRefreshToken(user._id);
        user.refreshToken = refreshToken;
        user.save();
        sendRefreshToken(res, refreshToken);
        sendAccessToken(req, res, accessToken);
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
})
//3. Logout a usser
router.post('/logout', (req, res) => {
    res.clearCookie('refreshtoken', {path: '/api/auth/refresh_token'});
    return res.json({message: 'Logged out'});
})
//4. Setup a protected route
router.post('/protected',isAuth, async (req, res)=>{
    try{
        const userId = req.userId;
        if(userId !== null){
           return res.json({success:true ,message:'This is protected data.'});
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
})
//5. Get a new accesstoken with a refresh token
router.post('/refresh_token', async (req, res) => {
    const token = req.cookies.refreshtoken;
    if(!token) return res.status(403).json({success:false, accessToken: ''});
    let payload = null;
    try {
        payload = await verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return res.status(403).json({success:false, accessToken: ''});
    } 
    const user = await User.findById(payload.userId);
    if(!user) return res.status(400).json({success:false, accessToken: ''});
    if(user.refreshToken !== token ){
        return res.status(403).json({success:false, accessToken: ''});
    }
    const accessToken = await createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.save();
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
})
module.exports = router;
