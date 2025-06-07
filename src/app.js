const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');
const communitiesRoutes = require('./routes/communitiesRoutes');
const nominatimProxy = require('./routes/nominatimRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const localcommerceRoutes = require('./routes/localcommerceRoutes');
const wasteManagement = require('./routes/wasteManagementRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Socket.IO setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
io.on('connection', (socket) => {
    socket.on('joinCommunity', (comunidadId) => {
        if (comunidadId) {
            socket.join(comunidadId);
        }
    });
});
app.set('io', io);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community_alerts', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/community_alerts' })
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', authRoutes);
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.use('/communities', communitiesRoutes);
app.use('/api/nominatim', nominatimProxy);
app.use('/alerts', alertRoutes);
app.use('/wastemanagement', wasteManagement);
app.use('/localcommerce', localcommerceRoutes);
app.use('/administration', adminRoutes);
app.use('/users', userRoutes);

// Inicializar Socket.IO
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});