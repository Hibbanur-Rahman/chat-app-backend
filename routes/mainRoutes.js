const express=require('express');
const { VerifyToken } = require('../middleware/authMiddleware');
const { UserLogin, UserRegister } = require('../controller/userController');
const Router=express.Router();

Router.post('/user-login',UserLogin);
Router.post('/user-register',UserRegister);

module.exports=Router;