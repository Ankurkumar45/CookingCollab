const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const recipeRoutes = require('./routes/recipeRoutes.js');
// const commentRoutes = require('./routes/commentRoutes.js');
// const registerRouter = require('./routes/register.js');
// const bodyParser = require('express-validator');

// Load environment variables before any other code
dotenv.config();

const app = express();

// Middleware
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/register', registerRouter);

//Connect to MongoDB
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});