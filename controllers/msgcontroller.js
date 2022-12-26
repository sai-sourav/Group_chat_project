const Msg = require('../Models/grpmsg');
const User = require('../Models/user');
const Groups = require('../Models/groups');
const Groupmembers = require('../Models/groupmems');
const Sequelize = require('sequelize');
const fs = require('fs');
const Op = Sequelize.Op;
const AWS = require("aws-sdk");

exports.postmessages = async (req,res,next) => {
    const user = req.user;
    const msg = req.body.message;
    const grpid = req.body.groupid;
    try{
        const group = await Groups.findByPk(grpid);
        if(msg !== ""){
            console.log(msg);
            const result = await group.createGrpmessage({
                msg: `${user.name}: ${msg}`
            })
        }
        if(req.file !== undefined){
            const file = req.file;
            const blob = file.buffer;
            const filename = `Group ${grpid}/${file.originalname}`;
            const fileurl = await uploadTos3(blob, filename);
            const uploadfile = await group.createGrpmessage({
                msg: `${user.name}:*${fileurl}`,
                filename: file.originalname,
                type: "file"
            })
        }
        res.status(201).json({
            created : true,
            status: "success"
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

function uploadTos3(data, filename) {

	const BUCKET_NAME = process.env.BUCKET_NAME;
	const IAM_USER_KEY = process.env.IAM_USER_KEY;   
	const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

	let s3bucket = new AWS.S3({
		accessKeyId: IAM_USER_KEY,
		secretAccessKey: IAM_USER_SECRET,
		Bucket: BUCKET_NAME
	});

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL :'public-read'
    }
    
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                reject(err);
            }else {
                resolve( s3response.Location);
            }
        });
    });

}