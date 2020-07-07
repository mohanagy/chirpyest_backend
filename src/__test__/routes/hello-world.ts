import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';

describe('GET /hello-world endpoint', () => {
  it('should response with hello-world text', (done) => {
    request(app)
      .get('/hello-world')
      .expect(200)
      .end((err, res) => {
        expect(res.text).to.include('Hello, World!');
        done();
      });
  });
});
