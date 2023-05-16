const express = require('express');
const router = express.Router();

const registoAdicaoEcopontoController = require('../controllers/registoAdicaoEcoponto.controller.js');

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
    .get(registoAdicaoEcopontoController.findAllRegistoAdicaoEcopontos)
    //.post(registoAdicaoEcopontoController.createRegistoAdicaoEcoponto);

router.route('/:idAdicaoEcoponto')
    .get(registoAdicaoEcopontoController.findOneRegistoAdicaoEcoponto)
    .delete(registoAdicaoEcopontoController.deleteRegistoAdicaoEcoponto);

router.route('/validar/:idAdicaoEcoponto')
    .put(registoAdicaoEcopontoController.validarRegistoAdicaoEcoponto);

router.all('*', function (req, res) {
    res.status(404).json({
        message: 'REGISTO ADICAO ECOPONTO: what???'
    });
}
)

module.exports = router;