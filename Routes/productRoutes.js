import  express  from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProducts,
  

} from '../Controllers/productController.js'
import CheckAuth from "../middleware/checkAuth.js";
import authorize from '../middleware/authorize.js';

const router = express.Router()


// endpoint para obtener productos
router.get('/', getProducts); 
  
// endpoint para obtener un producto por su id 
router.get('/:pid', getProductById );

// endpoint para crear un producto
router.post('/', CheckAuth, authorize('Admin') ,createProduct);

// endpoint para actualizar un producto
router.put('/:pid', CheckAuth, authorize('Admin'), updateProduct);

// endpoint para eliminar un producto
router.delete('/:pid', CheckAuth, authorize('Admin'), deleteProducts);


export default router;