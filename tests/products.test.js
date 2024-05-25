import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chai = require('chai');
const chaiHttp = require('chai-http');
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Product Router', () => {
  let token;

  before((done) => {
    chai.request(app)
      .post('/api/session/login')
      .send({ email: 'testuser@example.com', password: 'password' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should create a new product', (done) => {
    chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        stock: 100,
        category: 'Test Category',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'Test Product');
        done();
      });
  });

  it('should get all products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should delete a product by id', (done) => {
    chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product for Deletion',
        description: 'Test Description',
        price: 10,
        stock: 100,
        category: 'Test Category',
      })
      .end((err, res) => {
        const productId = res.body._id;
        chai.request(app)
          .delete(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });
});
