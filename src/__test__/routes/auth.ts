import request from 'supertest';
import app from '../../app';
import { dbConfig } from '../../database';
import buildDb from '../../database/build';
import { dto } from '../../helpers';
import { removeCognitoUser } from '../../helpers/auth';
import { usersServices } from '../../services';

const email = `${Math.random().toString(36).substring(7)}@gmail.com`;
before(async () => {
  await dbConfig.sync({ force: true });
});
describe('POST /api/v1/auth/signup endpoint', () => {
  let cognitoId = '';
  const filter = dto.generalDTO.filterData({ email });

  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await removeCognitoUser(app, cognitoId);
    }
  });
  before(async () => {
    await buildDb();
  });

  it('Validation should fail because the request body has no data', (done) => {
    request(app).post('/api/v1/auth/signup').expect(400, done);
  });
  it('Validation should fail because the password does not match required rules', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '1234', termsCondsAccepted: true })
      .expect(400, done);
  });
  it('Create User should succeed because email and password are not empty', (done) => {
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
  it('Create user should fail because the email is already in use', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true })
      .expect(500, done);
  });
});
