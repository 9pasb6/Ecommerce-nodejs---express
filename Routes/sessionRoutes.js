import  express  from "express";
import { 
    logIn,
    logOut,
    register,
   
 } from "../Controllers/sessionController.js";






const router = express.Router()

// log in endpoint
router.post('/login',   logIn)

// log in endpoint
router.post('/register',   register )

// log in endpoint
router.get('/logout',   logOut)

// // welcome endpoint private Route
// router.get('/welcome', CheckAuth,   sessionWelcome)







export default router;