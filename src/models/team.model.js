import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
        
    },
    mentorName:{
        type:String,
        required:true
    },
    mentorPhoneNo:{
        type:String,
        required:true
    },
    mentorEmail:{
        type:String,
        required:true
    }
},{timestamps:true})

const Team = mongoose.model('Team', teamSchema)

export default Team;

