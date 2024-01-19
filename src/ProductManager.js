// const generateId = require('./Helpers/generateId.js');
import generateId from '../Helpers/generateId.js';
// const fs = require('fs');
import fs from 'fs';
// const path = require('path');
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
      const filePath = path.join(__dirname, '../Persistence', 'PersistenciaBd.txt');
      fs.writeFileSync(filePath, data);
      console.log('Productos guardados en el archivo');
    } catch (error) {
      console.log('Error al guardar productos en el archivo', error);
    }
  }

  loadProductsFromBd() {
    try {
      const filePath = path.join(__dirname, '../Persistence', 'PersistenciaBd.txt');
      const data = fs.readFileSync(filePath, 'utf-8');
      const productLines = data.split('\n');
      this.products = productLines.map(line => JSON.parse(line.trim()));
    } catch (error) {
      console.log('Error al cargar productos desde el archivo', error);
    }
  }

  
  getProducts(limit) {
    try {
      let result = this.products;

      if (limit) {
        const parsedLimit = parseInt(limit, 10);
        result = this.products.slice(0, parsedLimit);
      }

      console.log('Listado de productos:');
      result.forEach(product => {
        console.log(product);
      });

      return result;
    } catch (error) {
      console.log(`Error al obtener los productos: ${error}`);
      return [];
    }
  }

  getProductById(id) {
    const foundProduct = this.products.find(product => product.id.toString() === id.toString());

    try {
      if (foundProduct) {
        console.log('Producto encontrado:', foundProduct);
        return foundProduct;
      } else {
        console.log('Producto no encontrado');
        return null; 
      }
    } catch (error) {
      console.log(error);
      return null;
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
export default productManager;