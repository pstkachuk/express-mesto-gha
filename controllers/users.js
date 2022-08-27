const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

//  создать пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError('Ошибка валидации, проверьте правильность заполнения полей'));
          } if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким Email уже существует'));
          } else {
            next(err);
          }
        });
    });
};

//  вернуть всех ользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

//  вернуть пользователя по ID
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректные данные'));
      } if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

//  изменить данные пользователя
const setUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректные данные'));
      } if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации, проверьте правильность заполнения полей'));
      } else {
        next(err);
      }
    });
};

//  изменить аватар
const setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректные данные'));
      } if (err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации, проверьте правильность заполнения полей'));
      } else {
        next(err);
      }
    });
};

//  авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-mega-giga-very-very-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  setUserInfo,
  setAvatar,
  login,
};
