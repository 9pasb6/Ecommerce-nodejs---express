// consumir los render
import  express  from "express";
import { 
    loginView,
    registerView,
    profileView
 } from "../Controllers/sessionController.js";
import CheckAuth from "../middleware/checkAuth.js";





const router = express.Router()

// log in endpoint
router.get('/login',   loginView)

// log in endpoint
router.get('/register',   registerView)

// log in endpoint
router.get('/profile', CheckAuth ,  profileView)









export default router;