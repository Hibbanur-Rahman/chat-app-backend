const express=require('express');
const { VerifyToken } = require('../middleware/authMiddleware');
const { UserLogin, UserRegister, GetAllUser } = require('../controller/userController');
const { saveMessage, getMessages } = require('../controller/messageController');
const { createChat, fetchChats, createGroupChat } = require('../controller/chatController');
const Router=express.Router();

Router.post('/user-login',UserLogin);
Router.post('/user-register',UserRegister);
Router.get('/all-user',GetAllUser);

Router.post('/chat',VerifyToken,createChat);
Router.get('/chats',VerifyToken,fetchChats);
Router.post('/group',VerifyToken,createGroupChat);

Router.post('/message',VerifyToken,saveMessage);
Router.get('/messages/:chatId',VerifyToken,getMessages);

module.exports=Router;