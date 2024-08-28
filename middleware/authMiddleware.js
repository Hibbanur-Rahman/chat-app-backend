const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const httpStatusCode = require("../constants/httpStatusCode");

const JwtSecretKey = process.env.JWT_SECRET;

const getToken = (user) => {
  const token = jwt.sign({ user: user }, JwtSecretKey, { expiresIn: "1d" });
  return token;
};

const VerifyToken = (req, res,next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(httpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: "Token is not found",
    });
  }

  try {
    const decoded = jwt.verify(token, JwtSecretKey);
    req.user = decoded.user;
    console.log(req.user);
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return res.status(httpStatusCode.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized Invalid token",
      error: error.message,
    });
  }
};

module.exports = { getToken, VerifyToken };
