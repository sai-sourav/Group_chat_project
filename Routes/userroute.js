const express = require('express');
const route = express.Router();
const usercontroller = require('../controllers/usercontroller');

route.post("/signup", usercontroller.signupuser);

module.exports = route;