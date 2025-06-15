const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author').populate('genre').exec();
    res.render('index', { title: 'Local Library', books });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/author/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).exec();

    if (!author) {
      return res.status(404).render('error', {
        message: 'Author not found',
        error: { status: 404, stack: 'Author with the specified ID does not exist.' },
      });
    }

    const books = await Book.find({ author: req.params.id }, 'title summary').exec();

    res.render('author_detail', { title: 'Author Details', author, books });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Server Error',
      error: { status: 500, stack: err.stack },
    });
  }
});

router.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author')
      .populate('genre')
      .populate('bookinstances') 
      .exec();

    if (!book) {
      return res.status(404).render('error', {
        message: 'Book not found',
        error: { status: 404, stack: 'Book with the specified ID does not exist.' },
      });
    }

    res.render('book_detail', { title: 'Book Details', book });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Server Error',
      error: { status: 500, stack: err.stack },
    });
  }
});

module.exports = router;
