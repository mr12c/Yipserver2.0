 import {asyncHandler}  from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { isValidObjectId } from "mongoose";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const RegisterUser = asyncHandler(
    async(req,res)=>{
        const {fullname,email,password,confirmPassword} = req.body;
        if(!fullname   ||!email ||!password ||!confirmPassword){
            throw new ApiError("All fields are required",400);
        }
        if(password!==confirmPassword){
            throw new ApiError(400,"Passwords do not match", );
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            throw new ApiError( 409,"Email already exists");
        }
        const createUser = await User.create({
            fullname,
            email,
            password
        })
        const createdUser = await User.findById(createUser._id).select(["-password -refreshToken"])
        if(!createdUser){
            throw new ApiError(500,"User not created");
        }
        return res.status(200).json(new ApiResponse(200,{createdUser},"user created successfully"))
    }

)



const generateAccessAndRefereshTokens = async(userId) =>{
        try {
            const user = await User.findById(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
    
            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })
    
            return {accessToken:accessToken, refreshToken:refreshToken}
    
    
        } catch (error) {
            throw new ApiError(500, "Something went wrong while generating referesh and access token")
        }
    }






    const LoginUser = asyncHandler(async (req, res) => {
        // Extract email and password from request body
        const {  email, password} = req.body;
        console.log( email,  password)
      
        // Check if email or password fields are empty
        if (!email) {
          throw new ApiError(400, "Email is required");
        }
        if (!password) {
          throw new ApiError(400, "Password is required");
        }
      
        // Check if the email exists in the database
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new ApiError(400, "Email does not exist");
        }
      
        // Verify if the password is correct
        const validOrNot = await existingUser.isPasswordCorrect(password);
        if (!validOrNot) {
          throw new ApiError(401, "Incorrect password");
        }
      
        // Generate access and refresh tokens
        
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingUser._id);
        // console.log(accessToken,refreshToken)
        // Retrieve the logged-in user data without the refreshToken and password fields
        const loggedInUser = await User.findById(existingUser._id).select("-refreshToken -password");
      
        // Set cookie options
        const options = {
          httpOnly: true,
          secure: false,
        };
      
        // Return the tokens and user data to the client
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken:accessToken,
            refreshToken:refreshToken,
          }, "User logged in successfully"));
      });

const LogoutUser = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:undefined}})
    // clear cookies
    const options = {
        httpOnly:true,
       secure:false
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user logged out succesfully"))
})
    

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
      throw new ApiError(401, "Unauthorized request");
  }
  console.log(incomingToken);
  try {
      const decodedToken = verifyJWT(incomingToken, process.env.REFRESH_TOKEN_SECRET);

      const user = await User.findById(decodedToken._id);
      if (!user){
          throw new ApiError(401, "Invalid refresh token from h1");
      }

      if (incomingToken !== user.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used");
      }

      const tokens = await generateAccessAndRefereshTokens(user._id);
      const { accessToken, refreshToken } = tokens;

      const options = {
          httpOnly: true,
          secure: false, // Set secure flag based on environment
          sameSite: 'strict',
      };

      return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200,{accessToken: accessToken, refreshToken: refreshToken},"refresh token and access token refresh succesfully"));
  } catch (error) {
      console.log(error);
      throw new ApiError(401, "Invalid refresh token");
  }
});


const registerUserDetail = asyncHandler(
  async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const registerUser = await User.findById(user._id).select(["-refreshToken password"])
    return res.status(200).json(new ApiResponse(200,{registerUser},"User detail fetched successfully"))
  }
)


const getAllUser = asyncHandler(async(req,res)=>{
  const users = await User.find();
  return res.status(200).json(new ApiResponse(200,{users},"All users fetched successfully"))
})


const getUserById = asyncHandler(
  async(req,res)=>{
    const {userId} = req.params;
  if(!isValidObjectId(userId)){
    throw new ApiError(400,"Invalid user id");
  }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    return res.status(200).json(new ApiResponse(200,{user},"User fetched successfully"))
  }
)

export {RegisterUser,
    LoginUser,
    LogoutUser,
    refreshAccessToken,
    registerUserDetail,
    getAllUser,
    getUserById
}




