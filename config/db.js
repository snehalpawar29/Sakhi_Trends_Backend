import mongoose from "mongoose";
// import connectDB from "./config/db.js";


const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongodb databse ${conn.connection.host}`);
    }
    catch(error){
console.log(`Error in MongoDb ${error}`);
    }
}
export default connectDB;