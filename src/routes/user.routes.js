import Router from "express"
import { LoginUser, RegisterUser,LogoutUser, refreshAccessToken, registerUserDetail, getAllUser, getUserById } from "../controllers/user.controller.js"
 
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.route('/register').post(RegisterUser)

router.route('/login').post(LoginUser)
router.route('/logout').post(verifyJWT,LogoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/userDetail').get(verifyJWT,registerUserDetail)
router.route('/getAllUsers').get(verifyJWT,getAllUser)
router.route('/:userId').get(verifyJWT,getUserById)



export default router 