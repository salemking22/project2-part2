const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL // ✅ Updated here
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const contactsRoutes = require('./routes/contacts');
app.use('/contacts', contactsRoutes);

const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

// Auth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.send('Logged out');
    });
});

// Protected route
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

app.get('/protected', ensureAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.displayName}`);
});

// Swagger setup
const swaggerDocs = require('./swagger');
swaggerDocs(app);

// Root route
app.get('/', (req, res) => {
    res.send('Project 2 API is running');
});

// Start server
app.listen(port, () => {
    console.log(`🌐 Server running on port ${port}`);
});