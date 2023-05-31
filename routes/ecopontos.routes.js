const express = require('express');
let router = express.Router();
const ecopontosController = require('../controllers/ecopontos.controller');
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

router.route('/').get(authController.verifyToken, ecopontosController.findAll);

router.route('/:ecopointID').get(authController.verifyToken, ecopontosController.findOne);

router.route('/validacao/:ecopointID').put(authController.verifyToken, ecopontosController.validateEcopoint);

router.route('/:ecopointID/use').post(authController.verifyToken, ecopontosController.useEcopoint);

router.route('/adicaoEcoponto').post(authController.verifyToken, ecopontosController.createAdicaoEcoponto)

router.route('/:ecopontID').delete(authController.verifyToken, ecopontosController.delete);

router.all('*', function (req, res) {
  res.status(404).json({ message: 'What???' });
});

module.exports = router;
