// ProductRepository que utiliza ProductDAO
import ProductDAO from '../Dao/ProductDAO.js';

export default class ProductRepository {
  constructor() {
    this.productDao = new ProductDAO();
  }

  async getProducts(options) {
    return this.productDao.findAll(options);
  }

  async getProductById(productId) {
    return this.productDao.findById(productId);
  }

  async addProduct(productData) {
    return this.productDao.create(productData);
  }

  async updateProduct(productId, productData) {
    return this.productDao.update(productId, productData);
  }

  async removeProduct(productId) {
    return this.productDao.delete(productId);
  }
}
