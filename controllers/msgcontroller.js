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

exports.getmessages = async (req,res,next) => {
    const user = req.user;
    try{
        const result = await user.getMessages();
        res.status(200).json({
            name : user.name,
            msg : result
        }); 
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}