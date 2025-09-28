const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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