import request from 'supertest';
import app from '../../app';
import buildDb from '../../database/build';

const email = `${Math.random().toString(36).substring(7)}@gmail.com`;
describe('POST /api/v1/auth/signup endpoint', () => {
  before(async () => {
    await buildDb();
  });

  it('validation should fails the request since no data', (done) => {
    request(app).post('/api/v1/auth/signup').expect(400, done);
  });
  it('validation should fails since password not match required rules', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '1234', termsCondsAccepted: true })
      .expect(400, done);
  });
  it('should create user normally', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true })
      .expect(201, done);
  });
  it("should fails since can't create two accounts with the same email ", (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true })
      .expect(403, done);
  });
});
