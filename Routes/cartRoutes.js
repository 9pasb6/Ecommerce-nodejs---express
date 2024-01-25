import  express  from "express";
import {  
    createCart,
    addProductToCart,
    getProductsToCart 
} from "../Controllers/cartController.js";

const router = express.Router()



router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart)
router.get('/:cid', getProductsToCart)






export default router;