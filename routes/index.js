const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', (req, res, next)=> {
  let resultArray = [];
  mongo.connect(url, (err, client)=> {
    assert.equal(null, err);
    const cursor = client.db(dbName).collection('user-data').find();﻿
    cursor.forEach((doc, err)=> {
      assert.equal(null, err);
      resultArray.push(doc);
    }, ()=> {
      client.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', (req, res, next)=> {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, (err, client)=> {
    assert.equal(null, err);
    client.db(dbName).collection('user-data').insertOne(item, (err, result)=> {
      assert.equal(null, err);
      console.log('Item inserted');
      client.close();
    });
  });

  res.redirect('/get-data');
});

router.post('/update', (req, res, next)=> {
  const item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  const id = req.body.id;

  mongo.connect(url, (err, client)=> {
    assert.equal(null, err);
    client.db(dbName).collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, (err, result)=> {
      assert.equal(null, err);
      console.log('Item updated');
      client.close();
    });
  });
  res.redirect('/get-data');
});

router.post('/delete', (req, res, next)=> {
  const id = req.body.id;

  mongo.connect(url, (err, client)=> {
    assert.equal(null, err);
    client.db(dbName).collection('user-data').deleteOne({"_id": objectId(id)}, (err, result)=> {
      assert.equal(null, err);
      console.log('Item deleted');
      client.close();
    });
  });
  res.redirect('/');
});

module.exports = router;