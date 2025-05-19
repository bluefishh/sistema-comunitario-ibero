const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/community_alerts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: 'supersecret', // cámbialo por una variable de entorno en producción
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/community_alerts' })
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
// Ruta para alertas
app.use('/alerts/all', alertRoutes);

app.use('/', authRoutes);

// Ruta login cuando sea la raíz
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});