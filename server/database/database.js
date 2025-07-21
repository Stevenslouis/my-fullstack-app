const mongoose = require('mongoose')


const connectToDB = async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URI);
       // console.log('mongo db connected successfully');
        
    }catch(err){
      //  console.log('mongodb connection failed', err);
        process.exit(1)

    }
}

module.exports = connectToDB