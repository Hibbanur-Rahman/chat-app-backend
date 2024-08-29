const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModels");
const MessageModel = require("../models/messageModel");
const httpStatusCode = require("../constants/httpStatusCode");

//create a new chat
const createChat = async (req, res) => {
  try {
    const { chatName, users } = req.body;

    // Check if chat already exists
    const existingChat = await ChatModel.findOne({
      isGroupChat: false,
      users: { $size: users.length, $all: users },
    });

    if (existingChat) {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "chat already exists",
        data: existingChat,
      });
    }

    //create a new chat
    const chat = await ChatModel.create({
      chatName,
      isGroupChat: users.length > 2,
      users,
      groupAdmin: req.user._id,
    });

    if (!chat) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "chat is not created",
      });
    }

    return res.status(httpStatusCode.CREATED).json({
      message: true,
      message: "Chat created successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

// Fetch all chats for a user
const fetchChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      users: {
        $elemMatch: {
          $eq: req.user._id,
        },
      },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({
        updatedAt: -1,
      });

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

// Create a group chat
const createGroupChat = async (req, res) => {
  try {
    const { users, chatName } = req.body;

    //check if users are valid
    const validUsers = await UserModel.find({
      _id: { $in: users },
    });

    if (validUsers.length != users.length) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid users",
      });
    }

    //create a new group chat
    const groupChat =await ChatModel.create({
      chatName,
      isGroupChat:true,
      users,
      groupAdmin:req.user._id,
    })

    return res.status(httpStatusCode.CREATED).json({
      success:true,
      message:'Group chat created successfully',
      data:groupChat,
    })
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!!",
      error: error.message,
    });
  }
};

module.exports = {
  createChat,
  fetchChats,
  createGroupChat,
};
