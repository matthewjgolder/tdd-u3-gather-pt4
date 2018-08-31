const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the single item page', () => {
    describe('shows the single item', () => {
      it('and is rendered', () => {
        // Setup - create an item to view
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');

        // Execute - Click on the first link (first item)
        browser.click('.item-card a');
        
        // Verify
        assert.include(browser.getText('#item-title'), itemToCreate.title);
        assert.include(browser.getText('#item-description'), itemToCreate.description);
        assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl);
      });
    });
});

