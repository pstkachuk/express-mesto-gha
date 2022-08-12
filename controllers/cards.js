const Card = require('../models/card');

//  создать карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  вернуть все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

//  удалить карточку
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send({ card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(201).send({ card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// убрать лайк
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива, если он есть
    { new: true },
  )
    .then((card) => res.status(200).send({ card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
