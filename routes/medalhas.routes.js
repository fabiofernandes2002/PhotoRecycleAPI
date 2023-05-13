const express = require('express');
const router = express.Router();

const medalhasController = require('../controllers/medalhas.controller.js');

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
    .post(medalhasController.createMedalha);

router.route('/:idMedalha')
    .get(medalhasController.findOneMedalha)
    .put(medalhasController.updateMedalha)
    .delete(medalhasController.deleteMedalha);

router.all('*', function (req, res) {
    res.status(404).json({
        message: 'MEDALHAS: what???'
    });
}
)

module.exports = router;