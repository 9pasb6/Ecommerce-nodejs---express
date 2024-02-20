import  express  from "express";
import { 
    newMessage,
    updateMessage,
    deleteMessage,
    getChatView
 } from "../Controllers/messageController.js";

 const router = express.Router()



 router.post('/', newMessage)
 router.post('update/:id', updateMessage)
 router.post('delete/:id', deleteMessage)
 router.get('/chat', getChatView);

 export default router;
 
