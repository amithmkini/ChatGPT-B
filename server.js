const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cron = require('node-cron');

// Update the OPENAI_SYSTEM_PROMPT in the .env file
// every 24 hours, and when the server starts
const updateChatBotPrompt = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateString = ` Current date: ${year}-${month}-${day}`;
  const prompt = process.env.OPENAI_SYSTEM_PROMPT_TEMPLATE + dateString;
  process.env.OPENAI_SYSTEM_PROMPT = prompt;
};

updateChatBotPrompt();
cron.schedule('0 0 * * *', () => {
  updateChatBotPrompt();
});

// Routes
const messageRoutes = require('./routes/messageRoute');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

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
