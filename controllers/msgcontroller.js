const Msg = require('../Models/grpmsg');
const User = require('../Models/user');
const Groups = require('../Models/groups');
const Groupmembers = require('../Models/groupmems');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.postmessages = async (req,res,next) => {
    const user = req.user;
    const msg = req.body.msg;
    const finalmessage = `${user.name}: ${msg}`
    const grpid = req.body.groupid;
    try{
        const group = await Groups.findByPk(grpid);
        const result = await group.createGrpmessage({
            msg: finalmessage
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
    const lastmessageid = req.query.lastmessageid;
    const grpid = req.query.groupid;
    try{
        const group = await Groups.findByPk(grpid);
        const result = await group.getGrpmessages({
            where: {
                id: { 
                    [Op.gt]: lastmessageid
                }
            }
        });
        res.status(200).json({
            msg : result
        }); 
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}