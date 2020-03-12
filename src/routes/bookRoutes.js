// SQL Server Code

// const express = require('express');

// const bookRouter = express.Router();

// const sql = require('mssql');

// const debug = require('debug')('app:bookRoutes');

// function router(nav) {
//   bookRouter.route('/').get((req, res) => {
//     (async function query() {
//       const request = new sql.Request();
//       const { recordset } = await request.query('select * from books');
//       res.render('bookListView', {
//         nav,
//         title: 'Library',
//         books: recordset,
//       });
//     })();
//   });

//   bookRouter
//     .route('/:id')
//     .all((req, res, next) => {
//       (async function query() {
//         const { id } = req.params;
//         const request = new sql.Request();
//         const { recordset } = await request
//           .input('id', sql.Int, id)
//           .query('select * from books where id = @id');
//         [req.book] = recordset;
//         next();
//       })();
//     })
//     .get((req, res) => {
//       res.render('bookView', {
//         nav,
//         title: 'Library',
//         book: req.book,
//       });
//     });

//   return bookRouter;
// }

// module.exports = router;

//

// MongoDB Code

const express = require('express');

const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/').get((req, res) => {
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
  });

  bookRouter.route('/:id').get((req, res) => {
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
  });
  return bookRouter;
}

module.exports = router;
