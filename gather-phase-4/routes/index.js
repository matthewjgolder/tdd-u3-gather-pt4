const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  
  console.log("post received"); 
  console.log( req.body);

  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }
});

// Single item view
router.get('/items/:item_id', async (req, res, next) => {
  var search = {'_id': req.params.item_id };
  const item = await Item.findOne(search);
  res.render('single', {item});
});

// Delete single item
router.post('/items/:item_id/delete', async (req, res, next) => {
  var search = {'_id': req.params.item_id };
  const response = await Item.deleteOne(search);  
  res.redirect('/');
});

// Update single item
router.get('/items/:item_id/update', async (req, res, next) => {
  var search = {'_id': req.params.item_id };
  const item = await Item.findOne(search);  
  res.render('update', {item: item});
});

router.post('/items/:item_id/update', async (req, res, next) => {
  
  console.log("post received"); 
  console.log( req.body);

  const {title, description, imageUrl} = req.body;
  const item = new Item({_id:req.params.item_id, title, description, imageUrl});
  item.validateSync();
  if (item.errors) {
    res.status(400).render('update', {item: item});
  } else {
    result = await item.update(item);
    console.log(result);
    res.redirect('/items/' + item._id);
  }
});

module.exports = router;
