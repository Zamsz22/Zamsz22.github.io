const fs = require('fs');
const crypto = require('crypto');

const USERS_FILE = 'credenciales.txt';

function encriptar(contrasena) {
  return crypto.createHash('sha256').update(contrasena).digest('hex');
}

function registrarUsuario(correo, contrasena) {
  const hash = encriptar(contrasena);
  const linea = `${correo},${hash}\n`;

  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    const existe = data.split('\n').some(line => line.startsWith(correo + ','));
    if (existe) return false; 
  }

  fs.appendFileSync(USERS_FILE, linea);
  return true;
}

function autenticarUsuario(correo, contrasena) {
  const hash = encriptar(contrasena);
  if (!fs.existsSync(USERS_FILE)) return false;

  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return data.split('\n').some(line => line.trim() === `${correo},${hash}`);
}

module.exports = {
  registrarUsuario,
  autenticarUsuario
};
