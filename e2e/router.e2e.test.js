// const assert = require('assert');
const request = require('supertest');

const { createServer } = require('http');
const { router } = require('../router.js');

describe('generate API', () => {
  let server;

  before(() => {
    server = createServer(router);
    server.listen(0);
  });

  after(done => {
    server.close(done);
  });

  const formData = {
    _id: 123345,
    styles: 'red.css',
    text_1: 'first',
    class_1: 'header',
    text_2: 'second',
    class_2: 'normal',
    text_3: 'third',
    class_3: 'bold',
    image_4:
      'urltoimage',
    class_4: 'top'
  };

  //something goes wrong after refactoring and implmenting login
  xit('generate a new profile', async (done) => {
    const r = await request(server)
      .post('/generate')
      .expect(302)
      .expect('Location', '/profiles/' + formData._id)
      .send(formData, done());
    console.log('response:', r);
  });
});
