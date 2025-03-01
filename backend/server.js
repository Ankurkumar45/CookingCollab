const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const recipeRoutes = require('./routes/recipeRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const registerRouter = require('./routes/register.js');
const { connectDB } = require('./config/db.js');

dotenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/register', registerRouter);

//Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});