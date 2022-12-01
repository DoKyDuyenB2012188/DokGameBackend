const {verify} = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
    const authorization = req.headers['authorization'];
    if(!authorization) return res.status(401).json({success: false, message: 'Access token not found'});
    const token = authorization.split(' ')[1];
    try {
        const {userId} = await verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({success: false, message:'Invalid token'});
    }
}

module.exports = {
    isAuth,
}