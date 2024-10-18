import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
        maxLength:100

    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }


},{timestamps:true})


const Chat = mongoose.model('Chat',chatSchema)

export default Chat;