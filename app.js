const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', userRouter);

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log('Пока все нормально');
});
