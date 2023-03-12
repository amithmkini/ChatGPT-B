const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const messageRoutes = require('./routes/messageRoute');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: `${process.env.REACT_APP_URL}}`,
}));

// Routes
app.use('/api/messages', messageRoutes);

// DB Config
mongoose.connect(
  `${process.env.MONGO_PROTOCOL}://` + 
  `${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@` +
  `${process.env.MONGO_HOST}${process.env.MONGO_PORT}/` + 
  `${process.env.MONGO_DATABASE}` + 
  `${process.env.MONGO_OPTIONS}`,)
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
