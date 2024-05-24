const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http=require('http');
const {Server}=require('socket.io');

const mainRoutes = require("./routes/mainRoutes");
const {dbConnection}=require('./config/dbConfig');
const { PORT, MONGO_URI } = process.env;

// mongoDb connection
dbConnection(MONGO_URI);


// middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "DELETE", "GET", "PUT","PATCH","HEAD"],
    credentials:true,
    preflightContinue:false,
    optionsSuccessStatus:204,
  })
);

//Routes
app.use('/',mainRoutes);

//create HTTP server
const server= http.createServer(app);
// Initialize Socket.io 
const io= new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST","DELETE","PUT","PATCH","HEAD"],
  }
});

//Handle Socket.io connections
io.on("connection",(socket)=>{
  console.log("A user connected");

  //Handle a chat message event
  socket.on("chat message",(msg)=>{
    console.log("Message"+msg);

    //Broadcast the message to all clients
    io.emit("chat message",msg);
  })


  //Handle disconnection
  socket.on("disconnect",()=>{
    console.log("A user disconnected");
  })
})



//Start the server
const port = PORT || 5000;
server.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
