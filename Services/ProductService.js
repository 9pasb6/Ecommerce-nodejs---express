// ProductService que utiliza ProductRepository
import ProductRepository from '../Repositories/ProductRepository.js';

export default class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async listProducts(filter, options) {
    // Aquí puedes aplicar filtros adicionales y lógica de negocio antes de obtener los productos
    return this.productRepository.getProducts(filter, options);
  }

  async findProductById(productId) {
    return this.productRepository.getProductById(productId);
  }

  async addNewProduct(productData) {
    // Puedes implementar validaciones o lógica de negocio antes de crear un producto
    return this.productRepository.addProduct(productData);
  }

  async modifyProduct(productId, productData) {
    // Puedes implementar validaciones o lógica de negocio antes de actualizar un producto
    return this.productRepository.updateProduct(productId, productData);
  }

  async eliminateProduct(productId) {
    // Puedes implementar validaciones o lógica de negocio antes de eliminar un producto
    return this.productRepository.removeProduct(productId);
  }
}
