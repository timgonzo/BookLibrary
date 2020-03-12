const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'timgonzo',
  password: 'm0rm0nZ69',
  server: 'timgonzo.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'BookLibrary',
};

app.use(morgan('tiny'));
sql.connect(config).catch(err => debug(err));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/views/', 'index.html')));

const nav = [
  { link: '/books/', title: 'Book' },
  { link: '/authors', title: 'Author' },
];
const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.get('/', (req, res) => {
  res.render('index', {
    nav: [
      { link: '/books/', title: 'Books' },
      { link: '/authors', title: 'Authors' },
    ],
    title: 'Library',
  });
});

app.listen(4000, () => debug(`Listening on port ${chalk.green(port)}`));
