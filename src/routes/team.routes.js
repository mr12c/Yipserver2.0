import Router from "express"
import { createTeam} from "../controllers/team.controller.js";
import { login } from "../controllers/team.controller.js";
const router = Router()

router.route('/register').post(createTeam);
router.route('/login').post(login);

 


export default router