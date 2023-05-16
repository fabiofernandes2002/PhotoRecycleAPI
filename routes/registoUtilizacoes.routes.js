const express = require('express');
const router = express.Router();

const registoUtilizacaoController = require('../controllers/registoUtilizacao.controller.js');
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
    .get(authController.verifyToken, registoUtilizacaoController.findAllRegistoUtilizacoes)
    //.post(authController.verifyToken, registoUtilizacaoController.createRegistoUtilizacao);

// all registoUtilizacao is validation = true
router.route('/validados')
    .get(authController.verifyToken, registoUtilizacaoController.findAllRegistoUtilizacoesValidados);

// all registoUtilizacao is validation = false
router.route('/naoValidados')
    .get(authController.verifyToken, registoUtilizacaoController.findAllRegistoUtilizacoesNaoValidados);

router.route('/:idRegistoUtilizacao')
    .get(authController.verifyToken, registoUtilizacaoController.findOneRegistoUtilizacao)
    //.put(authController.verifyToken, registoUtilizacaoController.updateRegistoUtilizacao)
    .delete(authController.verifyToken, registoUtilizacaoController.deleteRegistoUtilizacao);

// validadr a utilização de um ecoponto por admin quando estiver logado passando a validação para true
router.route('/validar/:idRegistoUtilizacao')
    .put(registoUtilizacaoController.validarRegistoUtilizacao);



router.all('*', function (req, res) {
    res.status(404).json({
        message: 'REGISTO UTILIZACAO: what???'
    });
})

module.exports = router;