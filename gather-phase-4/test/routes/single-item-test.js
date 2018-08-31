const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, findImageElementBySource} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('GET', async () => {
    it('shows the details of a single item', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Execute
      const response = await request(app).get('/items/' + item._id);

      // Test      
      assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
      
      const imageElement = findImageElementBySource(response.text, item.imageUrl);
      assert.equal(imageElement.src, item.imageUrl);

    })
  });
});
