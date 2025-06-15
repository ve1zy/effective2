const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const Genre = require('./models/genre');
const BookInstance = require('./models/bookinstance');

mongoose.connect('mongodb://127.0.0.1/local_library');

async function authorCreate(first_name, family_name, d_birth, d_death) {
  const author = new Author({
    first_name,
    family_name,
    date_of_birth: d_birth,
    date_of_death: d_death,
  });
  return await author.save();
}

async function genreCreate(name) {
  const genre = new Genre({ name });
  return await genre.save();
}

async function bookCreate(title, summary, author, isbn, genre) {
  const book = new Book({
    title,
    summary,
    author,
    isbn,
    genre,
  });
  return await book.save();
}

async function bookInstanceCreate(book, imprint, status, due_back) {
  const bookInstance = new BookInstance({
    book,
    imprint,
    status,
    due_back,
  });
  return await bookInstance.save();
}

async function populateDB() {
  try {
    await mongoose.connection.dropDatabase();

    const [author1, author2] = await Promise.all([
      authorCreate('Patrick', 'Rothfuss', '1973-06-06'),
      authorCreate('Ben', 'Bova', '1932-11-8'),
    ]);

    const [genre1, genre2] = await Promise.all([
      genreCreate('Fantasy'),
      genreCreate('Science Fiction'),
    ]);

    const [book1, book2] = await Promise.all([
      bookCreate('The Name of the Wind', 'A story about Kvothe...', author1, '978-0-7564-1133-6', [genre1]),
      bookCreate('The Martian', 'A story about an astronaut...', author2, '978-0-8041-3902-1', [genre2]),
    ]);

    await Promise.all([
      bookInstanceCreate(book1, 'London Gollancz, 2014.', 'Available', null),
      bookInstanceCreate(book2, 'Del Rey, 2014.', 'Loaned', '2023-12-31'),
    ]);

    console.log('Database populated successfully.');
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    mongoose.connection.close();
  }
}

populateDB();
