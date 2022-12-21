const Msg = require('../Models/msg');
const User = require('../Models/user');

exports.postmessages = async (req,res,next) => {
    const user = req.user;
    const msg = req.body.msg;
    try{
        const result = await user.createMessage({
            msg: msg
        })
        res.status(201).json({
            created : true
        }); 
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}