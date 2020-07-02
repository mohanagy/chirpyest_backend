import request from 'supertest';
import app from '../../app';

const name = Math.random().toString(36).substring(7);
describe('POST /api/v1/auth/signup endpoint', () => {
  it('validation should fails the request since no data', (done) => {
    request(app).post('/api/v1/auth/signup').expect(400, done);
  });
  it('validation should fails since password not match required rules', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ name, email: `${name}@gmail.com`, password: '1234', terms_conds_accepted: true })
      .expect(400, done);
  });
  it('should create user normally', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ name, email: `${name}@gmail.com`, password: '123asd!@#ASD', terms_conds_accepted: true })
      .expect(201, done);
  });
  it("should fails since can't create two accounts with the same email ", (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ name, email: `${name}@gmail.com`, password: '123asd!@#ASD', terms_conds_accepted: true })
      .expect(403, done);
  });
});
