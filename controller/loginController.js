const path = require('path');
const { autenticarUsuario } = require('../model/sesion');

function mostrarFormularioLogin(req, res) {
  res.sendFile(path.join(__dirname, '../view/login.html'));
}

function procesarLogin(req, res) {
  const { correo, contrasena } = req.body;
  const valido = autenticarUsuario(correo, contrasena);

  if (valido) {
    res.cookie('usuario', correo, { httpOnly: true, path: '/' });
    return res.redirect('/index.html');
  }
  res.redirect('/login?error=auth');
}


module.exports = {
  mostrarFormularioLogin,
  procesarLogin
};
