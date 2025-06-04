const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Rutas
const residuosRoutes = require('./routes/residuos.routes');
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');
const communitiesRoutes = require('./routes/communitiesRoutes');
const nominatimProxy = require('./routes/nominatimRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/community_alerts')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Sesiones
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/community_alerts' }),
  cookie: {
    sameSite: 'lax', // Permite que el navegador envíe cookies con fetch
    httpOnly: true
  }
}));

// Middleware global para usuario y ruta actual
app.use((req, res, next) => {
  res.locals.usuario = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
});

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', authRoutes);
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.use('/communities', communitiesRoutes);
app.use('/api/nominatim', nominatimProxy);
app.use('/alerts', alertRoutes);
app.use('/administration', adminRoutes);
app.use('/users', userRoutes);
app.use('/residuos', residuosRoutes);
app.use('/residuos', require('./routes/residuos.routes'));
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
