import  express  from "express";
import { 
    getCookie,
    createCookie,
    deleteCookie,
    cookieView
 } from "../Controllers/cookieController.js";



const router = express.Router()




//setCookie
router.post('/',createCookie)
//getCookie
router.get('/getCookie', getCookie)
//deleteCookie
router.delete('/', deleteCookie)
//view cookie
router.get('/viewCookie',   cookieView)

export default router