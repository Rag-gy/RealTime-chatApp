const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        mongoose.set('strictQuery', true);
        const connect = await mongoose.connect(process.env.MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Connected to MongoDB")
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;