// const assert = require('assert');
const request = require('supertest');

const { createServer } = require('http');
const { app } = require('../index.js');

describe('generate API', () => {
  let server;

  before(() => {
    server = createServer(app);
    server.listen(0);
  });

  after(done => {
    server.close(done);
  });

  const formData = {
    _id: 1,
    styles: 'red.css',
    text_1: 'first',
    class_1: 'header',
    text_2: 'second',
    class_2: 'normal',
    text_3: 'third',
    class_3: 'bold',
    image_4:
      'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg',
    class_4: 'top'
  };

  it('generate a new profile', async done => {
    const resp = await request(server)
      .post('/generate')
      .send(formData)
      .expect(302)
      .end(done);

    console.log('**********', location);

    const {
      headers: { location }
    } = resp;
  });
});
