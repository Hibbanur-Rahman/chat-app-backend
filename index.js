const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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

//app running or connection
const port = PORT || 5000;
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
