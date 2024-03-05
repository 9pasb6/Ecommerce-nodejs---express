import  express  from "express";
import {  
    createCart,
    addProductToCart,
    getProductsToCart,
    deleteAllProducts,
    deleteOneProduct

} from "../Controllers/cartController.js";

const router = express.Router()



router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart)
router.get('/:cid', getProductsToCart)
router.delete('/:cid', deleteAllProducts)
router.delete('/:cid/product/:pid', deleteOneProduct)





export default router;