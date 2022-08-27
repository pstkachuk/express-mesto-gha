require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

mongoose.connect('mongodb://localhost:27017/mestodb', { // база данных
  useNewUrlParser: true,
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
