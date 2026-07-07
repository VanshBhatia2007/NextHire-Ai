import mongoose from "mongoose";

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongoose connected successfully");
    }catch(err){
        console.log(`database error ${err}`);
    }
}

export default connectDb