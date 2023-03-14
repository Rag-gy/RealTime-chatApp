const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        mongoose.set('strictQuery', true);
        const connect = await mongoose.connect("mongodb+srv://Ambuli:aMBULI@cluster0.lkglxa1.mongodb.net/community?retryWrites=true&w=majority",{
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
