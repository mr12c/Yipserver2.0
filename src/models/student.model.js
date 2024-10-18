
import mongoose from 'mongoose';

const studentSchema =  new mongoose.Schema({
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
    },
    grade:{
        type:String,
        required:true
    }

},{timestamps:true})

const Student = mongoose.model('Student', studentSchema);



export default Student;