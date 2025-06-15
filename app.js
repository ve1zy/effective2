const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/local_library';
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./models/author');
require('./models/book');
require('./models/genre');
require('./models/bookinstance');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
