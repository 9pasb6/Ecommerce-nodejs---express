const generateId = require('./Helpers/generateId.js');
const fs = require('fs');
const path = require('path');

class ProductManager {
  
  constructor() {
    this.products = [];
    this.loadProductsFromBd();
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: generateId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    try {
      const existingProduct = this.products.find(product => product.id === newProduct.id);
      if (existingProduct) {
        console.log('Error: Producto con el mismo id ya existe.');
        return;
      }

      this.products.push(newProduct);
      this.saveProductsToBd();
      console.log('Producto agregado');
    } catch (error) {
      console.log('Error al agregar el producto', error);
    }
  }

  saveProductsToBd() {
    try {
      const data = this.products.map(product => JSON.stringify(product)).join('\n');
      const filePath = path.join(__dirname, 'Persistence', 'PersistenciaBd.txt');
      fs.writeFileSync(filePath, data);
      console.log('Productos guardados en el archivo');
    } catch (error) {
      console.log('Error al guardar productos en el archivo', error);
    }
  }

  loadProductsFromBd() {
    try {
      const filePath = path.join(__dirname, 'Persistence', 'PersistenciaBd.txt');
      const data = fs.readFileSync(filePath, 'utf-8');
      const productLines = data.split('\n');
      this.products = productLines.map(line => JSON.parse(line.trim()));
    } catch (error) {
      console.log('Error al cargar productos desde el archivo', error);
    }
  }

  getProducts() {
    console.log('Listado de productos:');
    this.products.forEach(product => {
      console.log(product);
    });
  }

  getProductById(id) {
    const foundProduct = this.products.find(product => product.id === id);

    try {
      if (foundProduct) {
        console.log('Producto encontrado:', foundProduct);
      } else {
        console.log('Producto no encontrado');
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateProducts(updatedProduct) {
    const indexToUpdate = this.products.findIndex(product => product.id === updatedProduct.id);

    try {
      if (indexToUpdate !== -1) {
        this.products[indexToUpdate] = updatedProduct;
        this.saveProductsToBd();
        console.log('Producto actualizado');
      }
    } catch {
      console.log('Error al actualizar el producto');
    }
  }
}

// Instancia de la clase
const productManager = new ProductManager();

// Agregar productos
productManager.addProduct('Panela', 'Descripción 1', 17.300, 'thumbnail1.jpg', 'ewq1', 12);
productManager.addProduct('Arroz', 'Descripción 2', 5.200, 'thumbnail2.jpg', 'ewq2', 15);
productManager.addProduct('Agua', 'Descripción 2', 5.200, 'thumbnail2.jpg', 'ewq3', 15);

// Mostrar todos los productos
productManager.getProducts();

// Buscar un producto por su id
productManager.getProductById(4);

// Producto a actualizar
const productToUpdate = {
  id: 1,
  title: 'Agua de panela update',
  description: 'Descripción update',
  price: 29.99,
  thumbnail: 'nueva-imagen.jpg',
  code: 'ewq123',
  stock: 120,
};

// Actualizar un producto por su id
productManager.updateProducts(productToUpdate);
