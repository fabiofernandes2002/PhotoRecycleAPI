const express = require('express');
let router = express.Router();
const utilizadoresController = require('../controllers/utilizadores.controller');
const authController = require('../controllers/auth.controller');

router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    // finish event is emitted once the response is sent to the client
    const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
    console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
  });
  next();
});

router
  .route('/')
  .get(authController.verifyToken, utilizadoresController.getAllUsers)
  .post(utilizadoresController.registo);

router.route('/top10').get(authController.verifyToken, utilizadoresController.getTop10);

router.route('/login').post(utilizadoresController.login);

router
  .route('/:id')
  .get(authController.verifyToken, utilizadoresController.getUserById)
  .patch(authController.verifyToken, utilizadoresController.editProfile)
  .delete(authController.verifyToken, utilizadoresController.deleteUser);

router.route('/perfil').get(authController.verifyToken, utilizadoresController.getUser);

router.all('*', function (req, res) {
  res.status(404).json({ message: 'What???' });
});

module.exports = router;
