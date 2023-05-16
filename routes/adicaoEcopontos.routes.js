const express = require('express');
const router = express.Router();

const adicaoEcopontosController = require('../controllers/adicaoEcopontos.controller.js');
const authController = require('../controllers/auth.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { // finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .post(authController.verifyToken, adicaoEcopontosController.createAdicaoEcoponto)

router.route('/validar/:idRegistoAdicaoEcoponto')
    .put(authController.verifyToken, adicaoEcopontosController.validarRegistoAdicaoEcoponto)


router.all('*', function (req, res) {
    res.status(404).json({
        message: 'ADICAO ECOPONTO: what???'
    });
})
// EXPORT ROUTES (required by APP)
module.exports = router;