const express = require('express');
const router = express.Router();

const desafiosController = require('../controllers/desafios.controller.js');
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
    .get(authController.verifyToken, desafiosController.findAllDesafios)
    .post(authController.verifyToken, desafiosController.createDesafio);

router.route('/:idDesafio')
    .get(authController.verifyToken, desafiosController.findOneDesafio)
    .put(authController.verifyToken, desafiosController.updateDesafio)
    .delete(authController.verifyToken, desafiosController.deleteDesafio);


// find desafios by estado
/* router.route('/estado/:estado')
    .get(desafiosController.findDesafioByEstado); */

router.all('*', function (req, res) {
    res.status(404).json({
        message: 'DESAFIOS: what???'
    });
})
// EXPORT ROUTES (required by APP)
module.exports = router;