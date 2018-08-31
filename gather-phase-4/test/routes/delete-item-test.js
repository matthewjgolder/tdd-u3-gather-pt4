const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, findImageElementBySource} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('Delete', async () => {
    it('deletes a single item from the database', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Execute
      const response = await request(app).post('/items/' + item._id + '/delete'); 
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');      
      
      const response2 = await request(app).get('/');
      // console.log(response2.text);
      
      assert.notInclude(response2.text, 'item-' + item._id);
    })
  });
});
