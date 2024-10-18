import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";    
import Chat from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
const receiveChatMessage = asyncHandler(
    async(req,res)=>{
        const {message,reciverId} = req.body;
        console.log(message,reciverId)
        const user = req.user;
        if(!message){
            throw new ApiError("All fields are required",400);
        }
        if(!user){
            throw new ApiError(401,"Unauthorized request",);
        }
        const loggedInUser = await User.findById(user._id);
        if(!loggedInUser){
            throw new ApiError(401,"Unauthorized request",);
        }
        const reciver = await User.findById(reciverId);
        if(!reciver){
            throw new ApiError(404,"Reciver not found",);
        }
        const newChat = await Chat.create({
            sender:loggedInUser._id,
            receiver:reciver._id,
            content:message
        });
        res.status(201).json(new ApiResponse(201,{newChat},"message sent successfully"));

        //... rest of the code...
    }
)


const getDirectMessage = asyncHandler(
    async(req,res) =>{
        const {recid} = req.params
        console.log(recid,"this is recivcer id ")
    
        if(!recid ){
            throw new ApiError(400,"reciver not found",);
        }
        const reciver =  await User.findById(recid)
        if(!reciver){
            throw new ApiError(404,"Reciver not found",);
        }
        const loggedInUser = await User.findById(req.user._id)
        if(!loggedInUser){
            throw new ApiError(401,"Unauthorized request",);
        }
        console.log(loggedInUser._id,

            "this is sender id"
        )
        
        const chats = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        {
                            sender: new mongoose.Types.ObjectId(loggedInUser._id),
                            receiver: new mongoose.Types.ObjectId(reciver._id)
                        },
                        {
                            sender: new mongoose.Types.ObjectId(reciver._id),
                            receiver: new mongoose.Types.ObjectId(loggedInUser._id)
                        }
                    ]
                }
                
            },
             
            {
                $sort:{
                    createdAt: 1
                }
            }
        ]);
    

        return res.status(200).json(new ApiResponse(200,{chats},"chats fetched successfully"))
    }
)




export {
    receiveChatMessage,
    getDirectMessage,
 
}