const path = require('path');
const { registrarUsuario } = require('../model/sesion');

function mostrarFormularioRegistro(req, res) {
  res.sendFile(path.join(__dirname, '../view/regs.html'));
}

function procesarRegistro(req, res) {
  const { correo, contrasena } = req.body;
  const exito = registrarUsuario(correo, contrasena);

  if (exito) {
    // redirijo al login con éxito
    return res.redirect('/login?success=register');
  }
  // redirijo de nuevo al register con error
  res.redirect('/register?error=register');
}

module.exports = {
  mostrarFormularioRegistro,
  procesarRegistro
};
