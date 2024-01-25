import  express  from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProducts

} from '../Controllers/productController.js'

const router = express.Router()


// endpoint para obtener productos
router.get('/', getProducts);
  
// endpoint para obtener un producto por su id 
router.get('/:pid', getProductById );

// endpoint para crear un producto
router.post('/', createProduct);

// endpoint para actualizar un producto
router.put('/:pid', updateProduct);

// endpoint para eliminar un producto
router.delete('/:pid', deleteProducts);

export default router;