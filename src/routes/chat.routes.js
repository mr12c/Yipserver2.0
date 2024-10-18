import Router from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getDirectMessage, receiveChatMessage } from '../controllers/chat.controller.js'



const router = Router()
router.route('/sendMessage').post(verifyJWT,receiveChatMessage)
router.route('/getDirectMessage/:recid').get(verifyJWT,getDirectMessage)



export default router