const { validationResult } = require("express-validator");
const httpStatusCode = require("../constants/httpStatusCode");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModels");
const { getToken } = require("../middleware/authMiddleware");

const UserLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: errors.array(),
      });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Email or password is empty",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = getToken(user);

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "User authenticated successfully",
      data: { user, token },
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const UserRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: errors.array(),
      });
    }

    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Email, password, or username is empty",
      });
    }

    const isExistingUser = await UserModel.findOne({ email });
    if (isExistingUser) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message: "User is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    if (!user) {
      return res.status(httpStatusCode.METHOD_NOT_ALLOWED).json({
        success: false,
        message: 'Something went wrong in UserModel',
      });
    }

    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

module.exports = {
  UserLogin,
  UserRegister,
};
