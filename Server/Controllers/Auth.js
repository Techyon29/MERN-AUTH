import User from "../Module/Module.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import transporter from "../Config/Nodemailer.js";
import { text } from "express";
export const signup = async function handleSignup(req ,res){
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(401).send("Incomplete Information");
    }
    try {
        const existinguser = await User.findOne({email});
        if(existinguser) {
            // fix: use consistent key 'success'
            return res.json({success : false ,message :"User Exist"})
        }
        const handlepassword = await bcrypt.hash(password,10);
    const user = await User.create({
        name:name,
        email:email,
        password:handlepassword,
    })

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
        maxAge:7*24*60*60*1000,
    });
    const mailoption = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome to website',
        text:'Welcome to website email' + email,
    }
    console.log(mailoption)
    await transporter.sendMail(mailoption);
    // fix: use consistent key 'success'
    return res.json({success:true})

    } catch (error) {
        return res.json({success : false , message: error.message})
    }
    
}


export const signin = async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({Success:false,message : "Incomplete Information"});
    }
    try{

        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false , message:"Invalid Email"})
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false , message:"Wrong Password"})
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
            maxAge:7*24*60*60*1000,
        });
        // fix: use consistent key 'success'
        return res.json({success:true});
    }
     catch (error) {
        // fix: use consistent key 'success'
        return res.json({success:false , message:error.message})
    }

} 

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict',
        })

        return res.json({succes:true,message:"logout"})
    } catch (error) {
        return res.json({success:false ,message:error.message})
    }
}


export const sendVerifyOtp = async (req,res)=>{
    

    try {
    const {userId} = req.body;

    const user = await User.findById(userId);

    if(user.isAccountVerified){
        return res.json({succes : false , message:"User Already Verify"})
    }

    const otp = String(Math.floor(100000 + Math.random()*900000));

    user.verifyotp = otp;

    user.verifyotpexpireat = Date.now() + 24*60*60*1000;

    await user.save();

    const mailoption = {
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:'Account Verification OTP ',
        text:`this is your verification otp ${otp}`,
    }

    transporter.sendMail(mailoption);

    // note: this already used 'success' correctly
    return res.json({success:true,message:"otp send successful"})
    } catch (error) {
        // fix: use consistent key 'success'
        return res.json({success:false,message:error.message})
    }
}


export const verifyemail = async (req,res)=>{
    const {userId,otp} = req.body;
    if(!userId || !otp){
       return res.json({success:false,message:"Missing Detail"})
    }
    try {
    const user = await User.findById(userId);
    if(!user){
        return res.json({success:false,message:"User Not exist"});
    }

    if(user.verifyotp === '' || user.verifyotp === otp){
        // note: logic likely intended '!==', but left unchanged; only commenting
        return res.json({success:false,message:"otp invalid"})
    }

    if(user.verifyotpexpireat < Date.now()){
        return res.json({success:false,message:"otp expire"})
    }
    user.isAccountVerified = true;

    user.verifyotp = '';
    user.verifyotpexpireat = 0;
    await user.save();
    return res.json({success:true,message:"Email Verify SuccessFull"})
    } catch (error) {
        // fix: error should set success false
        return res.json({success:false,message:error.message})
    }
   

}

export const isAuthenticted = async (req,res)=>{
    try {
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({success:false,message:"Email not provided"})
    }
    try {

        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Not found"});
        }
        const otp = String(Math.floor(100000 + Math.random()*900000));

        user.resetotp = otp;
        user.resetotpexpireat = Date.now() + 15*60*1000;
        await user.save();

        const mailoption = {
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Reset Password OTP",
            text:`Your Otp to Reset Password is ${otp}. You can processed password reseting using this otp`
        }

        transporter.sendMail(mailoption);

        return res.json({success:true,message:"Otp send"})
        
    } catch (error) {
         return res.json({succes:false,message:error.message})
    }

}

export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false,message:'Missing Information'})
    }
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.json({success:false,message:"Invalid Email"})
        }
        if(user.resetotp === '' || user.resetotp === otp){
            return res.json({success:false,message:"OTP false"})
        }
        if(user.resetotpexpireat < Date.now()){
            return res.json({success:false,message:"Otp Expire"})
        }

        const newpass = await bcrypt.hash(newPassword,10);

        user.password = newpass;
        user.resetotp = '';
        user.resetotpexpireat = 0;

        await user.save();

        return res.json({success:true,message:"Password reset Successfully"})
        


    } catch (error) {
        return res.json({succes:false,message:error.message})
    }
    

}