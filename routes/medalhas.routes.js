const express = require('express');
const router = express.Router();

const medalhasController = require('../controllers/medalhas.controller.js');
const authController = require('../controllers/auth.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { // finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
}
)

router.route('/')
    .get(medalhasController.findAllMedalhas)
    .post(authController.verifyToken, medalhasController.createMedalha);

router.route('/:idMedalha')
    .get(authController.verifyToken, medalhasController.findOneMedalha)
    .put(authController.verifyToken, medalhasController.updateMedalha)
    .delete(authController.verifyToken, medalhasController.deleteMedalha);

router.all('*', function (req, res) {
    res.status(404).json({
        message: 'MEDALHAS: what???'
    });
}
)

module.exports = router;