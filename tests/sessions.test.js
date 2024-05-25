import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chai = require('chai');
const chaiHttp = require('chai-http');
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Session Router', () => {
  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/sessions/register')
      .send({
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should log in an existing user', (done) => {
    chai.request(app)
      .post('/api/sessions/login')
      .send({ email: 'newuser@example.com', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should request password reset', (done) => {
    chai.request(app)
      .post('/api/sessions/reset-password')
      .send({ email: 'newuser@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
