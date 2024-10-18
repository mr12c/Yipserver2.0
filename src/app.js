import express from  'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
 import { ApiError } from './utils/ApiError.js';
 import { errorHandler } from './middlewares/error.js';
const app = express()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './Public')));

app.use(cors(
    {origin:process.env.CORS_ORGIN,
    Credential:true,
    
    }
))  /// this will allow to send requests to all 
// required middelwares
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))//// for getting the form data 
app.use(express.urlencoded({extended:true,limit:"16kb"}))  //// /for getting data from urlencoded extended is using for reading data from  nested objects also
app.use(express.static('Public'))
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});


import userRouter from "./routes/user.routes.js"
import chatRouter from "./routes/chat.routes.js"
import emailRouter from "./routes/email.routes.js"
import teamRouter from "./routes/team.routes.js"
app.use('/api/v1/users',userRouter)
app.use('/api/v1/chats',chatRouter)
app.use('/api/v1/mail',emailRouter)
app.use('/api/v1/team',teamRouter)
app.use(errorHandler);


export {app}
