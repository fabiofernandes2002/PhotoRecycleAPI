const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../models');
const config = require('../config/db.config.js');
const User = db.utilizadores;

// Registar um novo utilizador
exports.registo = async (req, res) => {
  try {
    // todos os campos são obrigatórios
    if (
      !req.body.username &&
      !req.body.password &&
      !req.body.confirmPassword &&
      !req.body.email &&
      !req.body.dataNascimento &&
      !req.body.morada &&
      !req.body.localidade &&
      !req.body.codigoPostal &&
      !req.body.tipo
    ) {
      return res.status(400).send({
        success: false,
        msg: 'Todos os campos são obrigatórios!',
      });
    }
    // verificar se o username já existe
    const usernameExist = await User.findOne({
      username: req.body.username,
    }).exec();
    if (usernameExist) {
      return res.status(400).send({
        success: false,
        msg: 'Username já existe!',
      });
    }
    // verificar se o email já existe
    const emailExist = await User.findOne({
      email: req.body.email,
    }).exec();
    if (emailExist) {
      return res.status(400).send({
        success: false,
        msg: 'Email já existe!',
      });
    }

    // verficar se a password e a confirmação são iguais
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        msg: 'Password e confirmação não são iguais!',
      });
    }
    // criar um novo utilizador
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      confirmPassword: req.body.confirmPassword,
      email: req.body.email,
      dataNascimento: req.body.dataNascimento,
      morada: req.body.morada,
      localidade: req.body.localidade,
      codigoPostal: req.body.codigoPostal,
      tipo: req.body.tipo || 'userNormal',
    });
    // guardar o utilizador na base de dados
    const userCreated = await user.save();
    res.status(201).json({
      success: true,
      msg: `Utilizador ${userCreated.username} registado com sucesso!`,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      let errors = [];
      Object.keys(err.errors).forEach((key) => {
        errors.push(err.errors[key].message);
      });
      return res.status(400).json({
        success: false,
        msgs: errors,
      });
    }
    res.status(500).send({
      success: false,
      msg: `Algo deu errado. Por favor, tente novamente mais tarde.`,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password)
      return res.status(400).json({
        success: false,
        msg: 'Email e password são obrigatórios!',
      });

    let user = await User.findOne({
      email: req.body.email,
    }).exec();
    if (!user) {
      return res.status(400).send({
        success: false,
        msg: 'Email incorreto!',
      });
    }
    // verificar se a password é válida
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        success: false,
        msg: 'Password incorreta!',
      });
    }
    // sign the given payload (user ID and role) into a JWT payload –builds JWT token, using secret key
    const token = jwt.sign(
      {
        id: user._id,
        tipo: user.tipo,
        username: user.username,
      },
      config.SECRET,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
    // return the JWT token for the future API calls
    res.status(200).send({
      success: true,
      msg: 'Login efetuado com sucesso!',
      token: token,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: `Algo deu errado. Por favor, tente novamente mais tarde.`,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log(req.loggedUserType);
    if (req.loggedUserType !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
      });
    }

    // Obter todos os usuários com atributos selecionados
    const users = await User.find(
      {},
      'username email morada localidade codigoPostal dataNascimento desafios pontos ecopontosUtilizados ecopontosRegistados medalhas tipo '
    );

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || 'Algo deu errado. Por favor, tente novamente mais tarde.',
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    if (
      !req.body ||
      !req.body.username ||
      !req.body.email ||
      !req.body.password ||
      !req.body.confirmPassword
    ) {
      return res.status(400).send({
        success: false,
        msg: 'Todos os campos são obrigatórios!',
      });
    }

    // verficar se a password e a confirmação são iguais
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({
        success: false,
        msg: 'Password e confirmação não são iguais!',
      });
    }

    // atualizar o array do utilizador com os novos dados
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        msg: `Utilizador com ID ${req.params.id} não encontrado!`,
      });
    }

    res.status(200).json({
      success: true,
      msg: `Dados do utilizador ${updatedUser.username} atualizado com sucesso!`,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({
      success: false,
      msg: 'Algo deu errado.',
    });
  }
};

// tabela de classificação dos utilizadores(tipo:userNormal) por pontos (top 10) - parametros da tabela: classificação, username, pontos
exports.getTop10 = async (req, res) => {
  try {
    const users = await User.find({ tipo: 'userNormal' }, 'classificacao username pontos')
      .sort({ pontos: -1 })
      .limit(10);

    let classificacao = 1;
    for (let i = 0; i < users.length; i++) {
      users[i].classificacao = classificacao;
      classificacao++;
    }

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || `Algo deu errado. Por favor, tente novamente mais tarde.`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.loggedUserId !== req.params.id && req.loggedUserType != 'admin') {
      return res.status(403).json({
        success: false,
        msg: 'Apenas o administrador pode aceder a esta funcionalidade!',
      });
    }

    // Buscar o usuário pelo ID com atributos selecionados
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: `Utilizador com ID ${req.params.id} não encontrado!`,
      });
    }

    res.status(200).json({
      success: true,
      msg: `Utilizador ${user.username} eliminado com sucesso!`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || `Algo deu errado. Por favor, tente novamente mais tarde.`,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.loggedUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: `Utilizador com ID ${req.loggedUserId} não encontrado!`,
      });
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message || `Algo deu errado. Por favor, tente novamente mais tarde.`,
    });
  }
};
