const express = require('express');
const route = express.Router();
const msgcontroller = require('../controllers/msgcontroller');
const Authorization = require('../middlewares/auth');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// multer({ dest: 'uploads/' })

route.post("/message", Authorization.authenticate, upload.single('file'), msgcontroller.postmessages);

route.get("/message", Authorization.authenticate, msgcontroller.getmessages);

module.exports = route;