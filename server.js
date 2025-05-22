// server.js
const express      = require('express');
const path         = require('path');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');

const loginRoutes = require('./routes/loginRoute');
const { mostrarFormularioLogin, procesarLogin }       = require('./controller/loginController');
const { mostrarFormularioRegistro, procesarRegistro } = require('./controller/registerController');

const app  = express();
const PORT = 3000;

/** 1️⃣ Parseo de formulario y cookies */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/** 2️⃣ Servir assets estáticos en las rutas que usas en tu diseño */
app.use('/styles', express.static(path.join(__dirname, 'view/styles')));
app.use('/img'   , express.static(path.join(__dirname, 'view/img')));
app.use('/view'  , express.static(path.join(__dirname, 'view'))); 
// -> /view/wizard.html, /view/login.html, /view/register.html, etc.

/** 3️⃣ Redirigir la raíz al index dinámico */
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

/** 4️⃣ Login / Register (GET para mostrar formulario, POST para procesar) */
app.get ('/login'   , mostrarFormularioLogin);
app.post('/api/login', procesarLogin);

app.get ('/register'   , mostrarFormularioRegistro);
app.post('/api/register', procesarRegistro);


/** 5️⃣ Index dinámico (y logout) via loginRoute.js */
app.use('/', loginRoutes);

/** 6️⃣ Levantar servidor */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
