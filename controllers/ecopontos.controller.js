const db = require('../models');
const Ecopoint = db.ecopontos;

exports.findAll = async (req, res) => {
  const tipo = req.query.tipo;

  const condition = tipo ? { tipo: new RegExp(tipo, 'i') } : {};
  try {
    // find function parameters: filter, projection (select) / returns a list of documents
    let data = await Ecopoint.find(condition)
      .select('title description published') // select the fields: do not show versionKey field
      .exec(); // execute the query
    res.status(200).json({ success: true, ecopoints: data });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    // findById(id) === findOne( {_id : id })
    const ecopoint = await Ecopoint.findById(req.params.ecopointID).exec();

    if (ecopoint === null)
      return res.status(404).json({
        success: false,
        msg: `Não foi possível encontrar o ecoponto como o ID: ${req.params.ecopointID}.`,
      });
    res.status(200).json({
      success: false,
      ecoponto: ecopoint,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};
