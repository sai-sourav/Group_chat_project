const express = require('express');
const route = express.Router();
const usercontroller = require('../controllers/usercontroller');
const Authorization = require('../middlewares/auth');

route.post("/signup", usercontroller.signupuser);

route.post("/signin", usercontroller.usersignin);

route.get('/getusername', Authorization.authenticate, usercontroller.getusername);

module.exports = route;