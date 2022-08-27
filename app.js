const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => { // пока так
  req.user = {
    _id: '63090e41cdf2e53ef2717272',
    // _id: '62f4f2f7b1b39f4320d8e970',
  };
  next();
});

app.post('/signin', login);

app.use('/', usersRouter);
app.use('/', cardsRouter);
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
