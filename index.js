const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const MessageModel= require('./models/messageModel');
const ChatModel=require('./models/chatModel');

const mainRoutes = require("./routes/mainRoutes");
const { dbConnection } = require("./config/dbConfig");
const { saveMessage } = require("./controller/messageController");
const { PORT, MONGO_URI } = process.env;

// mongoDb connection
dbConnection(MONGO_URI);

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "DELETE", "GET", "PUT", "PATCH", "HEAD"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

//Routes
app.use("/", mainRoutes);

//create HTTP server
const server = http.createServer(app);
// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD"],
  },
});

//Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  //join a chat room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

   // Handle incoming messages
   socket.on("chat-message", async ({ roomId, message, senderId }) => {
    console.log('Received message:', { roomId, message });

    if (!roomId || !message) {
      console.error('Room ID or message is undefined');
      return;
    }

    try {
      // Save the message to the database
      const newMessage = await MessageModel.create({
        sender: senderId,
        content: message,
        chat: roomId,
      });

      // Update the latest message in the chat
      await ChatModel.findByIdAndUpdate(roomId, {
        latestMessage: newMessage._id,
      });

      // Emit the message to the room
      io.to(roomId).emit('chat-message', newMessage);
      console.log(`Message sent to room ${roomId}:`, newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      // Optionally, you can emit an error event to the client
      socket.emit('error', { message: 'Error saving message' });
    }
  });

  //handle typing
  socket.on("typing", (roomId) => {
    socket.in(room).emit("typing", socket.id);
  });

  //handle stop typing
  socket.on("stop typing", (roomId) => {
    socket.in(roomId).emit("stop typing",socket.id);
  });

  //Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

//Start the server
const port = PORT || 5000;
server.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
