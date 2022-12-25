const User = require('../Models/user');
const Groups = require('../Models/groups');
const Groupmembers = require('../Models/groupmems');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getallmembers = async (req,res,next) => {
    const user = req.user;
    const grpid = req.query.groupid;
    let allusers = [];
    let obj;
    try{
        const group = await Groups.findByPk(grpid);
        const groupusers = await group.getUsers(
        {
            where : {
                id :{
                    [Op.ne]: user.id
                }
            }
        }
        );
        for(let i=0; i<groupusers.length; i++){
            obj = {
                name : groupusers[i].name,
                id : groupusers[i].id,
                isadmin : groupusers[i].groupmember.isadmin,
                isgroupmember : true
            }
            allusers.push(obj);
        }
        const otherusers = await User.findAll({where : {
            id: { 
                [Op.ne]: user.id
            },
        }});
        for(let i=0; i<otherusers.length; i++){
            // console.log(await group.hasUser(otherusers[i]));
            if(await group.hasUser(otherusers[i]) === false){
                obj = {
                    name : otherusers[i].name,
                    id : otherusers[i].id,
                    isadmin : false,
                    isgroupmember : false
                }
                allusers.push(obj);  
            }
        }
        res.status(200).json({
            users : allusers
        }); 
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}

exports.removefromgroup = async (req, res, next) => {
    const grpid = req.query.groupid;
    const userid = req.query.userid;
    try{
        const group = await Groups.findByPk(grpid);
        const user = await User.findByPk(userid);
        const result = await group.removeUser(user);
        res.status(200).json({
            deleted : true
        });
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}

exports.makeadmin = async (req,res,next) => {
    const grpid = req.query.groupid;
    const userid = req.query.userid;
    try{
        const groupmember = await Groupmembers.findOne(
            { where:
                {
                    userId : userid,
                    groupId : grpid
                }
            } 
        );
        await groupmember.update({ isadmin : true });
        res.status(200).json({
            success : true
        });
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}

exports.addmembertogroup = async (req,res,next) => {
    const grpid = req.query.groupid;
    const userid = req.query.userid;
    try{
        const group = await Groups.findByPk(grpid);
        const user = await User.findByPk(userid);
        await group.addUser(user);
        res.status(200).json({
            success : true
        });
    }catch(err){
        res.status(500).json({
            error : err
        });
    }
}