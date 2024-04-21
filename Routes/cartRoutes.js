import  express  from "express";
import {  
    createCart,
    addProductToCart,
    getProductsToCart,
    deleteAllProducts,
    deleteOneProduct,
    finalizePurchase 

} from "../Controllers/cartController.js";
import CheckAuth from "../middleware/checkAuth.js";

const router = express.Router()



router.post('/', createCart)
router.post('/:cid/product/:pid', addProductToCart)
router.get('/:cid', getProductsToCart)
router.delete('/:cid', deleteAllProducts)
router.delete('/:cid/product/:pid', deleteOneProduct)
router.post('/:cid/purchase', CheckAuth, finalizePurchase);






export default router;