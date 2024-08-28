const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/chatModel");
const httpStatusCode = require("../constants/httpStatusCode");

//save a message to the database
const saveMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;

    const message = await MessageModel.create({
      sender: senderId,
      content,
      chat: chatId,
    });

    //update the latest message in the chat
    await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "Message saved successfully",
      data: message,
    });
  } catch (error) {
   return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Error saving message",
    error: error.message
   })
  }
};

// Get messages for a specific chat
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await MessageModel.find({ chat: chatId })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 });

      return res.status(httpStatusCode.OK).json({
        success:true,
        message:"messages get successfully",
        data:messages
      })
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};



module.exports={
    saveMessage,
    getMessages
}