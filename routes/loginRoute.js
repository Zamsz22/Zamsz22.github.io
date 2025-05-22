// routes/loginRoute.js
const express = require('express');
const path    = require('path');
const fs      = require('fs');

const router = express.Router();

router.get('/index.html', (req, res) => {
  // 1) Depuración: ¿qué cookies recibimos?
  console.log('🐞 Cookies en /index.html:', req.cookies);

  // 2) Carga el HTML real
  const filePath = path.join(__dirname, '../index.html');
  let html = fs.readFileSync(filePath, 'utf-8');

  const usuario = req.cookies.usuario;

  // 3) Genera el snippet HTML correcto
  const loginHTML = usuario
    ? `
      <a href="../view/perf.html">
      <span style="margin-right: 10px;">
      Hola,  ${usuario}
      </span>
      </a>

      <a href="/logout" class="button">Cerrar sesión</a>
    `
    : `
      <a href="/register" class="register">Regístrate</a>
      <a href="/login" class="button">Iniciar sesión</a>
    `;

  // 4) Reemplaza el marcador
  html = html.replace('<!--LOGIN-->', loginHTML);

  // 5) Envía la página resultante
  res.send(html);
});

router.get('/logout', (req, res) => {
  res.clearCookie('usuario', { path: '/' });
  res.redirect('/index.html');
});

module.exports = router;
