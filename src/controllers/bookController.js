const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

module.exports = function bookController(bookService, nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'bookLibrary';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const collection = await db.collection('books');

        const books = await collection.find().toArray();

        res.render('bookListView', {
          nav,
          title: 'Library',
          books,
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    })();
  }

  function getById(req, res) {
    const { id } = req.params;

    const url = 'mongodb://localhost:27017';
    const dbName = 'bookLibrary';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to server');

        const db = client.db(dbName);

        const collection = await db.collection('books');

        const book = await collection.findOne({ _id: new ObjectID(id) });

        debug(book);

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', {
          nav,
          title: 'Library',
          book,
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    })();
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return {
    getIndex,
    getById,
    middleware,
  };
};
