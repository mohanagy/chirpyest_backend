import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';
import { authHelpers, dto } from '../../helpers';
import { usersServices } from '../../services';

const email = `naji+${Math.random().toString(36).substring(7)}@kiitos-tech.com`;
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
    token = await authHelpers.authenticateUser(app, { Username: email, Password: '123asd!@#ASD' }, cognitoId);
  });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await authHelpers.removeCognitoUser(app, cognitoId);
    }
  });

  it('should allow user to access his/her profile data', (done) => {
    request(app).get(`/api/v1/users/${userId}/profile`).set('Authorization', `Bearer ${token}`).expect(200, done);
  });
  it('should list user data', (done) => {
    request(app)
      .get(`/api/v1/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .end((error, response) => {
        if (error) throw error;
        expect(response.body.data).to.have.any.keys('name', 'image', 'id');
        done();
      });
  });
  it('should fail because user cannot access other users profile ', (done) => {
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
    token = await authHelpers.authenticateUser(app, { Username: email, Password: '123asd!@#ASD' }, cognitoId);
  });
  after(async () => {
    if (cognitoId) {
      await usersServices.deleteUser(filter);
      await authHelpers.removeCognitoUser(app, cognitoId);
    }
  });

  it('should allow the user to update his/her profile data', (done) => {
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

  it('should fail because the user trying to update his/her email', (done) => {
    request(app)
      .patch(`/api/v1/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send({ email: 'test@test.com' })
      .expect(400, done);
  });
});
