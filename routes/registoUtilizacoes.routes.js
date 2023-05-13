const express = require('express');
const router = express.Router();

const registoUtilizacaoController = require('../controllers/registoUtilizacao.controller.js');

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
    .get(registoUtilizacaoController.findAllRegistoUtilizacoes)
    .post(registoUtilizacaoController.createRegistoUtilizacao);

// all registoUtilizacao is validation = true
router.route('/validados')
    .get(registoUtilizacaoController.findAllRegistoUtilizacoesValidados);

// all registoUtilizacao is validation = false
router.route('/naoValidados')
    .get(registoUtilizacaoController.findAllRegistoUtilizacoesNaoValidados);

router.route('/:idRegistoUtilizacao')
    .get(registoUtilizacaoController.findOneRegistoUtilizacao)
    .put(registoUtilizacaoController.updateRegistoUtilizacao)
    .delete(registoUtilizacaoController.deleteRegistoUtilizacao);

// validadr a utilização de um ecoponto por admin quando estiver logado passando a validação para true
router.route('/validar/:idRegistoUtilizacao')
    .put(registoUtilizacaoController.validarRegistoUtilizacao);



router.all('*', function (req, res) {
    res.status(404).json({
        message: 'REGISTO UTILIZACAO: what???'
    });
})

module.exports = router;