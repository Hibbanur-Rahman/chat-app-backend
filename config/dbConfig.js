const mongoose=require('mongoose');


const dbConnection=(uri)=>{
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    const connection=mongoose.connection;

    connection.on("error",(error)=>{
        console.log(error);
    });
    connection.once("open",()=>{
        console.log("MongoDB connected successfully");
    })
}

module.exports={
    dbConnection
}