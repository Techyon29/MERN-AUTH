import express, { urlencoded } from "express";
import cors from "cors";
import 'dotenv/config'
import cookieParser from "cookie-parser";
import connectdb from './Config/Mongdb.js'
import authRouter from "./routes/auth.js";
import userrouter from "./routes/Userroute.js";

const app = express();
connectdb();
app.use(cookieParser());
// fix: use process.env.PORT instead of process.nextTick.PORT
const PORT = process.env.PORT || 4000;
connectdb();
const allowedOrigins = process.env.Frontend_URL;
app.use(express.json());
app.use(cors({origin: allowedOrigins,credentials:true}))
app.get("/:id",(req,res)=>{
    const id = req.params.id;
    return res.send("API WORKING");
})
app.use("/api/auth",authRouter);
app.use("/api",userrouter)
app.listen(PORT,()=>console.log(`Server Started : ${PORT}`));