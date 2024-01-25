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
      console.log(existingProduct);
      if (existingProduct) {
        console.log('Error: Producto con el mismo id ya existe.');
        return null;
      }

      this.products.push(newProduct);
      this.saveProductsToBd();
      console.log('Producto agregado');
      return newProduct;
    } catch (error) {
      console.log('Error al agregar el producto', error);
      return null;
    }
  }

  saveProductsToBd() {
    try {
      const data = JSON.stringify(this.products, null, 2); // Convierte el array completo a formato JSON con formato y tabulaciones
      const filePath = path.join(__dirname, '../Persistence', 'ProductBd.json');
      fs.writeFileSync(filePath, data);
      console.log('Productos guardados en el archivo JSON');
    } catch (error) {
      console.log('Error al guardar productos en el archivo JSON', error);
    }
  }
  

  loadProductsFromBd() {
    try {
      const filePath = path.join(__dirname, '../Persistence', 'ProductBd.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      
      // Parsea el contenido JSON del archivo
      this.products = JSON.parse(data);
  
      console.log('Productos cargados desde el archivo JSON');
    } catch (error) {
      console.log('Error al cargar productos desde el archivo JSON', error);
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

  updateProducts(id, updatedProduct) {

    const indexToUpdate = this.products.find(product => product.id.toString() === id.toString());
    console.log(indexToUpdate)


    if (!indexToUpdate) {
      console.log('Error al actualizar el producto')
      return null;
    }

    try {
      
        
          indexToUpdate.title = updatedProduct.title,
          indexToUpdate.description = updatedProduct.description,
          indexToUpdate.price = updatedProduct.price,
          indexToUpdate.thumbnail = updatedProduct.thumbnail,
          indexToUpdate.code = updatedProduct.code,
          indexToUpdate.stock = updatedProduct.stock,
          this.saveProductsToBd();
          console.log('Producto actualizado');
          return true;
       
      
    } catch (error) {
      console.log(error);
    }
}




  deleteProducts(id){

    const findProduct = this.products.find(product => product.id.toString() === id.toString());

    
    if (!findProduct) {
      console.log('Error al eliminar el producto')
      return null
    }
    

    try {
      this.products = newArray
      this.saveProductsToBd();
      return true;
    } catch (error) {
      console.log(error)
      return null
    }

  
  }


  updateStock(id, stock) {
    const findProduct = this.products.find(product => product.id.toString() === id.toString());
    console.log('desde updatestock' ,findProduct)

     
    if (!findProduct) {
      console.log('Producto no encontrado')
      return null
    }

    try {
     
        findProduct.stock = stock;
        this.saveProductsToBd();
        console.log('Stock del producto actualizado');
        return true;
      
    } catch {
      console.log('Error al actualizar el stock del producto');
      return null;
    }
  }

}

// Instancia de la clase
const productManager = new ProductManager();
//productManager.updateStock('1u867vob24o1hkuh6cit',5)
// Agregar productos
// productManager.addProduct('Panela', 'Descripción 1', 17.300, 'thumbnail1.jpg', 'ewq1', 12);
// productManager.addProduct('Arroz', 'Descripción 2', 5.200, 'thumbnail2.jpg', 'ewq2', 15);
// productManager.addProduct('Agua', 'Descripción 2', 5.200, 'thumbnail2.jpg', 'ewq3', 15);

// Mostrar todos los productos
//productManager.getProducts();

// Buscar un producto por su id
//productManager.getProductById(4);

// Producto a actualizar
// const productToUpdate = {
//   id: 1,
//   title: 'Agua de panela update v2 ',
//   description: 'Descripción update',
//   price: 29.99,
//   thumbnail: 'nueva-imagen.jpg',
//   code: 'ewq123',
//   stock: 120,
// };

// Actualizar un producto por su id
//productManager.updateProducts(productToUpdate);
export default productManager;