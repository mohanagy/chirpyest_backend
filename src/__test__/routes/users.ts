import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import { authHelpers, dto } from '../../helpers';
import { usersServices } from '../../services';

const email = `${Math.random().toString(36).substring(7)}@gmail.com`;
describe('GET /api/v1/users/:id/profile endpoint', () => {
  let cognitoId: string;
  let userId: string;
  let token: string;
  const filter = dto.generalDTO.filterData({ email });
  before(async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true });
    const {
      body: {
        data: { cognitoId: cognitoIdResult, id },
      },
    } = response;
    cognitoId = cognitoIdResult;
    userId = id;
    await authHelpers.confirmCognitoUser(app, email);
    token = await authHelpers.authenticateUser(app, { Username: email, Password: '123asd!@#ASD' }, cognitoId);
  });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await authHelpers.removeCognitoUser(app, cognitoId);
    }
  });

  it('every user can access his/her information only', (done) => {
    request(app).get(`/api/v1/users/${userId}/profile`).set('Authorization', `Bearer ${token}`).expect(200, done);
  });
  it('every user should has list of data', (done) => {
    request(app)
      .get(`/api/v1/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .end((error, response) => {
        if (error) throw error;
        expect(response.body.data).to.have.any.keys('name', 'image', 'id');
        done();
      });
  });
  it('user cannot access other profiles ', (done) => {
    request(app).get(`/api/v1/users/9999/profile`).set('Authorization', `Bearer ${token}`).expect(401, done);
  });
});

describe('PATCH /api/v1/users/:id/profile endpoint', () => {
  let cognitoId: string;
  let userId: string;
  let token: string;
  const filter = dto.generalDTO.filterData({ email });
  const userData = {
    name: 'testName',
    image: 'https://picsum.photos/200',
    paypalAccount: 'paypal@test.com',
    newsletterSubscription: true,
  };
  before(async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email, password: '123asd!@#ASD', termsCondsAccepted: true });
    const {
      body: {
        data: { cognitoId: cognitoIdResult, id },
      },
    } = response;
    cognitoId = cognitoIdResult;
    userId = id;
    await authHelpers.confirmCognitoUser(app, email);
    token = await authHelpers.authenticateUser(app, { Username: email, Password: '123asd!@#ASD' }, cognitoId);
  });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await authHelpers.removeCognitoUser(app, cognitoId);
    }
  });

  it('every user has the ability to edit his/her data', (done) => {
    request(app)
      .patch(`/api/v1/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(userData)
      .end((error, response) => {
        if (error) throw error;
        expect(response.body.data).to.eql({ id: userId, ...userData });
        done();
      });
  });

  it('user cannot update his/her email', (done) => {
    request(app)
      .patch(`/api/v1/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send({ email: 'test@test.com' })
      .expect(400, done);
  });
});
