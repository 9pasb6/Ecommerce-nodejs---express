import ProductService from '../Services/ProductService.js';

const productService = new ProductService();

const createProduct = async (req, res) => {
  try {
    // Asegúrate de que userId se extrae del token de usuario autenticado
    const { userId } = req.user; // Esto requiere middleware de autenticación que ponga user en req
    const newProductData = { ...req.body, owner: userId };
    const createdProduct = await productService.addNewProduct(newProductData);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto', details: error });
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { pid } = req.params;
    const { userId, role } = req.user; // Asegúrate de obtener estos datos del token o sesión
    const product = await productService.findProductById(pid);
    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    // Verifica si el usuario es el propietario o un administrador
    if (product.owner.equals(userId) || role === 'Admin') {
      await productService.deleteProduct(pid);
      res.json({ msg: 'Producto eliminado con éxito' });
    } else {
      res.status(403).json({ msg: 'No autorizado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto', details: error });
  }
};

const getProducts = async (req, res) => {
  try {
    const { limit, page, category } = req.query;
    const filter = category ? { category } : {};
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const productList = await productService.listProducts(filter, options);
    res.json(productList);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos', details: error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.findProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', details: error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productService.modifyProduct(req.params.pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto', details: error });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProducts
};
