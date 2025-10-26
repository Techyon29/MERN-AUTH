import mongoose from "mongoose";


const connectdb = async ()=>{
    await mongoose.connect(`${process.env.MongoDBURL}/Auth`).then(()=>console.log("Database")).catch((err)=>console.log("error " + err))
}

export default connectdb;