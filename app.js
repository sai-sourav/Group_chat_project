const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cron = require("node-cron");
const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:4000"],
    },
});
dotenv.config();

io.use(async(socket, next) => {
    const token = socket.handshake.auth.token;
    try{
        const result = jwt.verify(token, process.env.TOKEN_SECRET);
        const userid = result.userid;
        const user = await User.findByPk(userid);
        socket.user = user;
        next();
    }catch(err){
        if(err){
            socket.emit('error', {
                error : "token error"
            })
        }
    }
})

io.on('connection', socket => {
    let opengroup = 0;
    socket.on("join-group", group => {
        if (socket.lastRoom) {
            socket.leave(socket.lastRoom);
            socket.lastRoom = null;
        }
        socket.join(group);
        socket.lastRoom = group;
        opengroup = group
        console.log(`${socket.user.name} joined ${group} `)
        // socket.join(group);
    })
    socket.on('sendmessage', (uname, message) => {
        socket.to(opengroup).emit("recieve-message", uname, message);
    })
})

const bodyparser = require('body-parser');
const Cors = require('cors');

const sequelize = require('./util/database');

const userroute = require('./Routes/userroute');
const msgroute = require('./Routes/msgroute');
const grouproute = require('./Routes/grouproute');
const membersroute = require('./Routes/membersroute');

const User = require('./Models/user');
const Grpmsg = require('./Models/grpmsg');
const Grpmems = require('./Models/groupmems');
const Group = require('./Models/groups');
const Archive = require('./Models/ArchivedChat');


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

cron.schedule("59 23 * * *", async function() {
    try{
        const DATE_START = new Date().setHours(0, 0, 0, 0);
        const DATE_END = new Date().setHours(23, 59, 59, 0);

        const allMessages_from_main = await Grpmsg.findAll({
            where: {
                createdAt: { 
                    [Op.gt]: DATE_START,
                    [Op.lt]: DATE_END
                }
            }
        });

        await Archive.bulkCreate(allMessages_from_main);

        await Grpmsg.destroy({
            where: {
                createdAt: { 
                    [Op.gt]: DATE_START,
                    [Op.lt]: DATE_END
                }
            }
        });

        console.log("cron job is successfull");


    }catch(err){
        if(err){
            console.log("cron job failed!");
        }
    }
});

sequelize
.sync()
// .sync( {force : true} )
.then( result => {
    app.listen(process.env.PORT || 4000);
})