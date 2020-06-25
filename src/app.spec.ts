import { expect } from 'chai';
import request from 'supertest';
import app from './app';

describe('GET /hello-world endpoint', () => {
  it('responds with hello-world text', (done) => {
    request(app)
      .get('/hello-world')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.equal('Hello, World!');
        done();
      });
  });
});
