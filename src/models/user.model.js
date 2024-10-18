import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config();


const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    avtar:{
        type:String,
        default: function() {
            return `https://ui-avatars.com/api/?name=${this.fullname}&size=128`;
        }
    }
    ,
    refreshToken:{
        type:String,
        default:undefined
    }

    
},{timestamps:true})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


userSchema.methods.isPasswordCorrect = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      console.error('Error comparing passwords:', err);
      throw err;
    }
  };


 userSchema.methods.generateAccessToken =  function (){
    console.log(process.env.ACESS_TOKEN_SECRET)
     return    jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
         
        }
        ,
        process.env.ACESS_TOKEN_SECRET,
        { expiresIn:process.env.ACESS_TOKEN_EXPIRY }
    )
    
    
 }
 userSchema.methods.generateRefreshToken =  function(){
    return  jwt.sign(
        {
            _id:this._id,
           

        }
        ,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn:process.env.REFRESH_TOKEN_EXPIRY }
    )
 }




const User = mongoose.model("User",userSchema)




export default User;