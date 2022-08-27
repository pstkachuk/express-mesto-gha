const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо авторизироваться');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-mega-giga-very-very-strong-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизироваться'));
  }

  req.user = payload;
  next();
};
