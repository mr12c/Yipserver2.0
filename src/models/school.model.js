import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
         
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true
    },
    contactNumber:{
        type: String,
        required: true,
        
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type:String,
        required: true
    }

},)


const School = mongoose.model('School', schoolSchema);

export default School;