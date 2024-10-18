// generate boilerplate code 
import mongoose from 'mongoose';

const mentorSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactNo:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    }
},{timestamps:true})

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;