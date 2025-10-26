import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{type:String , requried:true},
    email:{type:String, required:true , unqiue:true},
    password:{type:String, required:true},
    verifyotp:{type:String , default:''},
    verifyotpexpireat:{type:Number , default : 0},
    isAccountVerified:{type:Boolean,default : false},
    resetotp:{type:String,deafult: ''},
    resetotpexpireat:{type:String,deafult:0}
})

const User = mongoose.model.user || mongoose.model("user",UserSchema);
export default User;