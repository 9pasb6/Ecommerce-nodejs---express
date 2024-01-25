import generateId from '../Helpers/generateId.js';
import productManager from './ProductManager.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
class CartManager {
    
    constructor() {
        this.id = generateId();
        this.carts = [];
        this.productManager = productManager; // Pasa la instancia de productManager al constructor
        this.loadCartFromBd();
      }

    createCart() {
     
      const newCart = {
        id: generateId(),
        products: [],
      };
      this.carts.push(newCart);
      this.saveCartToBd();
      console.log('Nuevo carrito creado con ID:', newCart.id);
      return true;
    }
  
    addProductToCart(cartId, product, quantity) {
        const findCart = this.carts.find(cart => cart.id.toString() === cartId);
    
        if (!findCart) {
            console.log('Carrito no encontrado');
            return false;
        }
    
        const { id, stock } = product;
    
        console.log('Este es el id', id);
        console.log('Este es el stock actual', stock);
    
        // Verificar disponibilidad de la cantidad
        if (quantity > stock || stock === 0) {
            console.log('La cantidad no está disponible');
            return false;
        }
    
        const addProduct = {
            id: id,
            quantity: quantity,
        };
    
        try {
            if (findCart.products.length !== 0) {
                console.log('CARRO NO VACIO');
                const findProductIndex = findCart.products.findIndex(product => product.id.toString() === addProduct.id);
    
                if (findProductIndex !== -1) {
                    const existingProduct = findCart.products[findProductIndex];
                    const newQuantity = existingProduct.quantity + addProduct.quantity;
    
                    console.log('Quantity incrementando', existingProduct.quantity);
    
                    const newStock = stock - quantity;
                    productManager.updateStock(id, newStock);
                    console.log('Stock actualizado desde el cart');
    
                    existingProduct.quantity = newQuantity;
                    findCart.products[findProductIndex] = existingProduct;
                } else {
                    console.log('Producto no encontrado en el carrito, agregando nuevo producto');
                    findCart.products.push(addProduct);
                }
            } else {
                findCart.products.push(addProduct);
            }
    
            // Guardar el carrito actualizado en la BD
            this.saveCartToBd();
            console.log('Producto agregado al carrito');
    
            const newStock = stock - quantity;
            productManager.updateStock(id, newStock);
            console.log('Stock actualizado desde el cart');
            
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    getProductsToCart(id){
        try {
            
        const findCartProducts = this.carts.find(cart => cart.id.toString() === id);
        console.log('Productos encontrados desde getProductsToCart: ',findCartProducts.products)
        return findCartProducts

        } catch (error) {
                console.log(error)
                return false
        }
    }
  
    removeProductFromCart(productId) {
      
      this.carts.forEach(cart => {
        cart.products = cart.products.filter(product => product.id !== productId);
      });
  
      this.saveCartToBd();
      console.log('Producto eliminado de todos los carritos');
    }
  
    saveCartToBd() {
      try {
        const data = JSON.stringify(this.carts, null, 2);
        const filePath = path.join(__dirname, '../Persistence', 'CartBd.json');
        fs.writeFileSync(filePath, data);
        console.log('Carritos guardados en el archivo JSON');
      } catch (error) {
        console.log('Error al guardar carritos en el archivo JSON', error);
      }
    }
  
    loadCartFromBd() {
      try {
        const filePath = path.join(__dirname, '../Persistence', 'CartBd.json');
        const data = fs.readFileSync(filePath, 'utf-8');
  
        const cartData = JSON.parse(data);
  
        // Verificar si los datos en el archivo son un arreglo válido de carritos
        if (Array.isArray(cartData) && cartData.every(cart => cart.id && Array.isArray(cart.products))) {
          this.carts = cartData;
          console.log('Carritos cargados desde el archivo JSON');
        } else {
          console.log('El archivo JSON no contiene datos válidos para los carritos');
        }
      } catch (error) {
        console.log('Error al cargar carritos desde el archivo JSON', error);
      }
    }
  }
  
//   // Ejemplo de uso
   const cartManager = new CartManager();
 
// // //   Crear un nuevo carrito y guardarlo en la BD
  // cartManager.createCart();

//   const productToAdd = productManager.getProductById('i2t05cgjmug1hkuh6cj3');
//   cartManager.addProductToCart('kpipd0899so1hl0nrorq',productToAdd, 5);
  
  //artManager.getProductsToCart('kpipd0899so1hl0nrorq')
  
  export default cartManager;
  