const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

//  создать пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      res.status(400).send({ message: 'Произошла ошибка' });
      console.log(err);
    });
};

//  вернуть всех ользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

//  вернуть пользователя по ID
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send({ user });
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
const setUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => res.status(400).send({ message: 'Произошла ошибка' }));
};

//  изменить аватар
const setAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  setUserInfo,
  setAvatar,
};
