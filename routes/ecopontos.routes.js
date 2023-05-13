const express = require('express');
let router = express.Router();
const ecopontosController = require('../controllers/ecopontos.controller');

router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    // finish event is emitted once the response is sent to the client
    const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
    console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
  });
  next();
});

router.route('/').get(ecopontosController.findAll);
/* .post(ecopontosController.create); */

router.route('/:ecopontoID').get(ecopontosController.findOne);

router.all('*', function (req, res) {
  res.status(404).json({ message: 'What???' });
});

module.exports = router;
