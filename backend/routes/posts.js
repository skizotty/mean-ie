const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  multer({
    storage: storage
  }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: 'Post Added Successfully',
        success: true,
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery.then(documents => {
    return Post.count(),
      fetchedPosts = documents

  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      success: true,
      maxPosts: count
    });
  }).catch((err, docu) => {
    console.log(err);
  });
});

router.put(
  '/:id',
  multer({
    storage: storage
  }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({
      _id: req.params.id
    }, post).then(result => {
      console.log(result);
      res.status(200).json({
        message: 'update successful',
        success: true
      });
    });
  }
);

router.delete('/:id', (req, res, next) => {
  console.log(req.param);
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    res.status(200).json({
      message: 'post deleted!',
      success: true
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json({
        message: 'post fetched successfully!',
        success: true,
        post: post
      });
    } else {
      res.status(404).json({
        message: 'post not found!',
        success: false
      });
    }
  });
});

module.exports = router;
