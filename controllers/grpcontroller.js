const Groups = require('../Models/groups');

exports.creategroup = async (req,res,next) => {
    const user = req.user;
    const groupname = req.body.groupname;
    try{
        const group = await Groups.create({
            name: groupname
        });
        const grpmember = await group.addUser(user, { through: { isadmin : true }});
        res.status(201).json({
            created : true
        });
    }catch(err){
        if(err){
            res.status(500).json({
                error: err
            })
        }
    }
}

exports.getgroups = async (req,res,next) => {
    const user = req.user;
    let obj;
    let grouparray = [];
    try{
        const groups = await user.getGroups();
        
        for(let i=0; i<groups.length; i++){
            obj = {
                groupname : groups[i].name,
                groupid : groups[i].id,
                isadmin : groups[i].groupmember.isadmin
            }
            grouparray.push(obj);
        }
        res.status(200).json({
            groups: grouparray
        });
    }catch(err){
        if(err){
            res.status(500).json({
                error: err
            })
        }
    }
}