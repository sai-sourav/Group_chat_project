const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const bodyparser = require('body-parser');
const Cors = require('cors');
const sequelize = require('./util/database');

const userroute = require('./Routes/userroute');
const msgroute = require('./Routes/msgroute');

const User = require('./Models/user');
const Msg = require('./Models/msg');
const app = express();

Msg.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Msg);

app.use(bodyparser.json());

app.use(Cors({
    origin: "*",
    methods: ["GET", "POST"]
}))

app.use(userroute);
app.use(msgroute);

app.use((req, res, next) => {
    if (req.url === '/'){
        req.url = "html/signup.html"
    }
    res.sendFile(path.join(__dirname,`Public/${req.url}`));
})

sequelize
.sync()
// .sync( {force : true} )
.then( result => {
    app.listen(process.env.PORT || 4000);
})