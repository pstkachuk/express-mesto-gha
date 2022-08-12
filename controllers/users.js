const User = require('../models/user');

//  создать пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  вернуть всех ользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  вернуть пользователя по ID
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  изменить данные пользователя
const setUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
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
