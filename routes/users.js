const router = require('express').Router();

const {
  getUsers,
  getUser,
  setUserInfo,
  setAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);
router.get('/users/:userId', getUser);
router.patch('/users/me', setUserInfo);
router.patch('/users/me/avatar', setAvatar);

module.exports = router;
