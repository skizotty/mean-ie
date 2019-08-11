const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const path = require('path');
// meanApp I5wBNWBWtPE2LCs0
mongoose
  .connect(
    'mongodb+srv://meanApp:I5wBNWBWtPE2LCs0@mean-cluster-v9qen.mongodb.net/node-angular?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection Failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POSTS,PATCH,DELETE,OPTIONS,PUT'
  );
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
