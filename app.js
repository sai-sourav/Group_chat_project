const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const userroute = require('./Routes/userroute');
const app = express();

app.use(bodyparser.json());

app.use(userroute);

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