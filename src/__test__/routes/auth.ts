import request from 'supertest';
import app from '../../app';
import { dto } from '../../helpers';
import { removeCognitoUser } from '../../helpers/auth';
import { usersServices } from '../../services';

const email = `${Math.random().toString(36).substring(7)}@gmail.com`;
describe('POST /api/v1/auth/signup endpoint', () => {
  let cognitoId = '';
  const filter = dto.generalDTO.filterData({ email });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await removeCognitoUser(app, cognitoId);
    }
  });

  it('validation should fails the request since no data', (done) => {
    request(app).post('/api/v1/auth/signup').expect(400, done);
  });
  it('validation should fail because the password does not match required rules', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '1234', termsCondsAccepted: true })
      .expect(400, done);
  });
  it('should create user normally', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true })
      .expect((res) => {
        const {
          body: {
            data: { cognitoId: cognitoIdResult },
          },
        } = res;
        cognitoId = cognitoIdResult;
      })
      .expect(201, done);
  });
  it("should fails since can't create two accounts with the same email ", (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true })
      .expect(403, done);
  });
});
