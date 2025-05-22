const path = require('path');
const { autenticarUsuario } = require('../model/sesion');

exports.procesarLogin = (req, res) => {
  const { correo, contrasena } = req.body;
  if (autenticarUsuario(correo, contrasena)) {
    res.cookie('usuario', correo, { httpOnly: true, path: '/' });
    return res.redirect('/');
  }
  // redirect con query para disparar notificación
}