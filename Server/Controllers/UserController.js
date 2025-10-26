import User from "../Module/Module.js";


export const getUserData = async (req,res)=>{
    
    try {
        const {userId} = req.body;
        if(!userId){
            return res.json({success:false,message:"Please Log in"})
        }

        const user = await User.findById(userId);

        if(!user){
            return res.json({success:false,message:"No User"})
        }

        const message = {
            name:user.name,
            email:user.email,
            Authentication:user.isAccountVerified,
        }


        // fix: use consistent key 'success'
        return res.json({success:true,userData:message})



    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}