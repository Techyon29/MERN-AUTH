import jwt from 'jsonwebtoken';

const userAuth = async (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.json({success:false,message:"Not Authorize"})
    }
    try {
        const tokendeconded = jwt.verify(token,process.env.JWT_SECRET)

        if(tokendeconded.id){
            req.body = req.body || {};
            req.body.userId = tokendeconded.id;
            req.userId = tokendeconded.id;
        }
        else{
            return res.json({success:false,message:'Not Authorized Login Again'})
        }

        next();
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export default userAuth;