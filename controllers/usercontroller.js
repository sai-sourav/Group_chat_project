const bcrypt = require('bcrypt');
const User = require('../Models/user');
const saltRounds = 10;
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
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

exports.usersignin = async (req, res, next) => {
    try{
        const emailid = req.body.emailid;
        const pswd = req.body.pswd;
        if((emailid === "") || (pswd === "")){
            return res.status(500).json({fields : "empty"});
        }
        let search = await User.findAll({
            where: {
                emailid: emailid
            }
        });
        if (search.length > 0){
            search = search[0];
            bcrypt.compare(pswd, search.password, async (err,result) => {
                if(err){
                    throw new Error("something went wrong");
                }
                else{
                    if(result === true){
                        res.status(200).json({
                            email : true,
                            pswd : true,
                            token : generateaccesstoken(search.id)
                        })
                    }
                    else {
                        res.status(401).json({
                            email : true,
                            pswd : false
                        });
                    }
                }
            })
        }else {
            res.status(404).json({
                email : false,
                pswd : false
            });
        }
    }catch(err) {
        if(err) {
           res.status(500).json({
            error : err
           });
        }
    }
}

function generateaccesstoken(id) {
    return jwt.sign({ userid : id } , process.env.TOKEN_SECRET);
}