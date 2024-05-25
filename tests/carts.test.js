import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chai = require('chai');
const chaiHttp = require('chai-http');
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Cart Router', () => {
  let token;
  let cartId;
  let productId;

  before((done) => {
    chai.request(app)
      .post('/api/session/login')
      .send({ email: 'testuser@example.com', password: 'password' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should create a new cart', (done) => {
    chai.request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        cartId = res.body._id;
        done();
      });
  });

  it('should add a product to the cart', (done) => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 10,
      stock: 100,
      category: 'Test Category',
    };

    chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(201);
        productId = res.body._id;

        chai.request(app)
          .post(`/api/carts/${cartId}/products/${productId}`)
          .set('Authorization', `Bearer ${token}`)
          .query({ quantity: 1 })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg', 'Producto agregado al carrito con éxito');
            done();
          });
      });
  });

  it('should get all products in the cart', (done) => {
    chai.request(app)
      .get(`/api/carts/${cartId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('products').that.is.an('array');
        done();
      });
  });
});
