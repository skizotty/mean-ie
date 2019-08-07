const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POSTS,PATCH,DELTE,OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post Added Successfully',
    success: true
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'nvufeinvofn123',
      title: 'Post Title!',
      content: 'This is coming from the server.'
    },
    {
      id: 'nvufeinvofn123',
      title: 'Post Title number 2!',
      content: 'This is coming from the server, again lol.'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts,
    success: true
  });
});

module.exports = app;
