const bcrypt = require('bcrypt');
const User = require('../Models/user');
const saltRounds = 10;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;  

exports.signupuser = async (req, res, next) => {
    const name = req.body.name;
    const emailid = req.body.emailid;
    const phone = req.body.phone;
    const pswd = req.body.pswd; 
    try{
        let search = await User.findAll({
            where: {
                [Op.or]: [{emailid: emailid}, {phone: phone}]
            }
        });
        search = search[0];
        if(!search){
            bcrypt.hash(pswd, saltRounds, async(err,hash) => {
                if(err){
                    throw "something went wrong"; 
                }
                const response = await User.create({
                    name : name,
                    emailid : emailid,
                    password : hash,
                    phone : phone
                });
                res.status(201).json({
                    found : false,
                    created : true
                });
            });
        }else{
            res.status(200).json({
                found : true,
                created : false
            })
        }
    }catch(err) {
        if(err) {
           res.status(500).json({
            found : false,
            created : false,
            error : err
           });
        }
    }
}