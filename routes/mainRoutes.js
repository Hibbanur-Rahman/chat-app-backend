const express=require('express');
const { VerifyToken } = require('../middleware/authMiddleware');
const { UserLogin, UserRegister, GetAllUser } = require('../controller/userController');
const Router=express.Router();

Router.post('/user-login',UserLogin);
Router.post('/user-register',UserRegister);
Router.get('/all-user',GetAllUser);

Router.post('/chat',VerifyToken,);


module.exports=Router;