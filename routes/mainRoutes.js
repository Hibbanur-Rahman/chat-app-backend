const express=require('express');
const { VerifyToken } = require('../middleware/authMiddleware');
const Router=express.Router();

Router.post('/user-login',VerifyToken,);

module.exports=Router;