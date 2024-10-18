import {asyncHandler}  from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
 
import School from "../models/school.model.js";
import Mentor from "../models/mentor.model.js";
import Student from "../models/student.model.js";
import Team from "../models/team.model.js";
 






 
const createTeam = asyncHandler(async(req, res) => {
     const {team_name , password} = req.body;
     if(!team_name   || !password ){
         throw new ApiError(400,"All fields are required");
     }
     const teamExists = await Team.findOne({ 'name': team_name });
     if (teamExists) {
         throw new ApiError(409, "Team name already exists! Please choose a different name");
     }
     const team = await Team.create({name: team_name, password});
     if(!team){
        throw new ApiError(404,"error while creating team");
     }

     return res.status(200).json(new ApiResponse(200,{team},"team created successfully"))


})


const login = asyncHandler(async(req, res) => {
   const {team_name,password} = req.body;
   if(!team_name ||!password){
       throw new ApiError(400,"All fields are required");
   }
   const team = await Team.findOne({name: team_name});
   if(!team){
       throw new ApiError(404,"team not found");
   }
   if(team.password!==password){
       throw new ApiError(401,"Invalid password");
   }
   

   return res.status(200).json(new ApiResponse(200,{team},"login successfully"))


})


export {createTeam,login}
