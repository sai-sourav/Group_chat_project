const express = require('express');
const route = express.Router();
const grpmembercontroller = require('../controllers/grpmembercontroller');
const Authorization = require('../middlewares/auth');

route.get("/groupmembers", Authorization.authenticate, grpmembercontroller.getallmembers);

route.get("/makeadmin", Authorization.authenticate, grpmembercontroller.makeadmin );

route.get("/removefromgroup", Authorization.authenticate, grpmembercontroller.removefromgroup);

route.get("/addmembertogroup", Authorization.authenticate, grpmembercontroller.addmembertogroup);

module.exports = route;