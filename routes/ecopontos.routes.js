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

const multer = require("multer");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const multerUpload = multer({ storage: storage }).single("image");

router.route('/').get(authController.verifyToken, ecopontosController.findAll);

router.route('/:ecopointID').get(authController.verifyToken, ecopontosController.findOne);

router.route('/validacao/:ecopointID').put(authController.verifyToken, ecopontosController.validateEcopoint);

router.route('/:id/use').post(multerUpload, authController.verifyToken, ecopontosController.useEcopoint);

router.route('/adicaoEcoponto').post( multerUpload, authController.verifyToken, ecopontosController.createAdicaoEcoponto)

router.route('/:id').delete(authController.verifyToken, ecopontosController.deleteEcopontoById);

router.all('*', function (req, res) {
  res.status(404).json({ message: 'What???' });
});

module.exports = router;
