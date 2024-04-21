// DAO para Product
import Product from '../Models/Product.js';

export default class ProductDAO {
  async findAll(options) {
    return Product.paginate({}, options);
  }

  async findById(productId) {
    return Product.findById(productId);
  }

  async create(productData) {
    const product = new Product(productData);
    return product.save();
  }

  async update(productId, productData) {
    return Product.findByIdAndUpdate(productId, productData, { new: true });
  }

  async delete(productId) {
    return Product.findByIdAndDelete(productId);
  }
}
