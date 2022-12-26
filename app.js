const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
dotenv.config();

const bodyparser = require('body-parser');
const Cors = require('cors');

const sequelize = require('./util/database');
const usercontroller = require('./controllers/usercontroller');

const userroute = require('./Routes/userroute');
const msgroute = require('./Routes/msgroute');
const grouproute = require('./Routes/grouproute');
const membersroute = require('./Routes/membersroute');

const User = require('./Models/user');
const Grpmsg = require('./Models/grpmsg');
const Grpmems = require('./Models/groupmems');
const Group = require('./Models/groups');


const app = express();

Grpmsg.belongsTo(Group, {constraints: true, onDelete: 'CASCADE'});
Group.hasMany(Grpmsg);

User.belongsToMany(Group, { through: Grpmems});
Group.belongsToMany(User, { through: Grpmems});


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(Cors({
    origin: "*"
}));

const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:4000"],
    },
});

// io.use(async(socket, next) => {
//     const token = socket.handshake.auth.token;
//     try{
//         const result = jwt.verify(token, process.env.TOKEN_SECRET);
//         const userid = result.userid;
//         const user = await User.findByPk(userid);
//         socket.user = user;
//         next();
//     }catch(err){
//         if(err){
//             socket.emit('error', {
//                 error : "token error"
//             })
//         }
//     }
// })

// io.on('connection', socket => {
//     socket.on('last-message-id', async (lastmessageid) => {
//         const user = socket.user;
//         try{
//             const result = await user.getMessages({
//                 where: {
//                     id: { 
//                         [Op.gt]: lastmessageid
//                     }
//                 }
//             });
//             socket.emit('messages', {
//                 name : user.name,
//                 msg : result
//             })
//             // res.status(200).json({
//             //     name : user.name,
//             //     msg : result
//             // }); 
//         }catch(err){
//             // res.status(500).json({
//             //     error : err
//             // });
//             socket.emit('error', {
//                 error : "something went wrong"
//             })
//         }
//     })
// })

app.use(userroute);
app.use(msgroute);
app.use(grouproute);
app.use(membersroute);

app.use((req, res, next) => {
    if (req.url === '/'){
        req.url = "html/signup.html"
    }
    res.sendFile(path.join(__dirname,`Public/${req.url}`));
});

sequelize
.sync()
// .sync( {force : true} )
.then( result => {
    app.listen(process.env.PORT || 4000);
})