const dbConfig = require('../config/db.config.js');
const mongoose = require('mongoose');
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.URL;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

db.desafios = require('./desafios.model.js')(mongoose);
db.registoutilizacaos = require('./registoUtilizacao.model.js')(mongoose);
db.medalhas = require('./medalhas.model.js')(mongoose);
db.registoadicaoecoponto = require('./registoAdicaoEcoponto.model.js')(mongoose);
db.adicaoecopontos = require('./adicaoEcopontos.model.js')(mongoose);
db.utilizadores = require('./utilizadores.model.js')(mongoose);
db.ecopontos = require('./ecopontos.model.js')(mongoose);
/* db.pontos = require('./pontos.model.js')(mongoose); */
module.exports = db;
