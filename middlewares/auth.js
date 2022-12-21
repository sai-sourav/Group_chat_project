const jwt = require('jsonwebtoken');
const User = require('../Models/user');
exports.authenticate = async (req,res,next) => {
    const token = req.header('Authorization');
    try{
        const result = jwt.verify(token, process.env.TOKEN_SECRET);
        const userid = result.userid;
        const user = await User.findByPk(userid);
        if(!user){
            return res.status(401).json({
                error : "unauthorized"
            })
        }
        else{
            req.user = user;
        }
        next();

    } catch(err){
        if(err){
            res.status(500).json({
                error : "token error"
            })
        }
    }
}