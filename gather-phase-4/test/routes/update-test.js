const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const { parseTextFromHTML, buildItemObject, seedItemToDatabase, findImageElementBySource} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

// Note: I had to use this to check the value attribute of the input.
// This means that the use of parseTextFromHTML on create testing for '' isn't correct as the value should be checked.

const parseTextAttributeFromHTML = (htmlAsString, selector, attribute) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);  
  if (selectedElement !== null) {
    return selectedElement.value;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

describe('Server path: /items/:item._id/update', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders existing input fields', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Execute
      const response = await request(app).get('/items/' + item._id + '/update'); 
      
      // uncomment this to see response logged, 
      // console.log(response.text);
      // console.log(item);

      /*
       * These should work but the parseTextFromHTML returns empty string - think this is because the 
       * value is contained in the value attribute, and not the element text. NB this means that the create test is giving incorect results 
       * as it isn't really testing the value attribute of the inputs.
      assert.include(parseTextFromHTML(response.text, 'input#title-input'), item.title);
      assert.include(parseTextFromHTML(response.text, 'input#imageUrl-input'), item.imageUrl); 
      */

     assert.include(parseTextFromHTML(response.text, 'textarea#description-input'), item.description);
     assert.include(parseTextAttributeFromHTML(response.text, 'input#title-input[value]'), item.title);     
     assert.include(parseTextAttributeFromHTML(response.text, 'input#imageUrl-input[value]'), item.imageUrl); 

    });
  });

  describe('PUT', () => {
    it('updates the item, and redirects to single item display', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Execute
      //const response = await request(app).get('/items/' + item._id + '/update'); 
      //console.log()
/* temporarily disable update to see if it make any different to out of stack error.
      item.title += " title";
      item.description += " description";
      item.imageUrl += "/imageUrl";
*/
      console.log("posting item ...");
      console.log(item);
    
      // Do the post
      const response2 = await request(app)
        .post('/items/' + item._id + '/update')                
        .type('form') // this causes a strange strack trace but but without it, what to do ??
        .send(item)

      console.log("response 2 ")
      console.log(response2);
        
      const updatedItem = await Item.findOne({_id: item._id});
      console.log("updated item", updatedItem);
      assert.isOk(updatedItem, 'Item was not updated successfully in the database');
      assert.equal(item.title, updatedItem.title);
      assert.equal(item.description, updatedItem.description);
      assert.equal(item.imageUrl, updatedItem.imageUrl);
      assert.notEqual(item.__v, updatedItem.__v);
    });
    
  });

});
