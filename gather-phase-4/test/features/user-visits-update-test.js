const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the update item page', () => {
    describe('shows the item to update', () => {
      it('and is successfully updated', () => {
        // Setup - create an item to view
        const item = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', item.title);
        browser.setValue('#description-input', item.description);
        browser.setValue('#imageUrl-input', item.imageUrl);
        browser.click('#submit-button');

        // Click on the first link (first item)
        browser.click('.item-card a');

        // Open the update page.
        browser.click('.update-button');

        console.log(browser.getHTML);

        // Initial values are set correctly
        assert.include(browser.getAttribute('#title-input', 'value'), item.title);
        assert.include(browser.getText('#description-input'), item.description);
        assert.include(browser.getAttribute('#imageUrl-input', 'value'), item.imageUrl);

        // Prepare item to be updated.
        item.title += "-title";
        item.description += "-description";
        item.imageUrl += "-imageUrl";

        // Apply updates
        browser.setValue('#title-input', item.title);
        browser.setValue('#description-input', item.description);
        browser.setValue('#imageUrl-input', item.imageUrl);

        browser.click('#submit-button');

        console.log(browser.getHTML);

        // Attributes updated in the single item page after form submission
        assert.include(browser.getText('#item-title'), item.title);
        assert.include(browser.getText('#item-description'), item.description);
        assert.include(browser.getAttribute('body img', 'src'), item.imageUrl);

      });
    });
});

