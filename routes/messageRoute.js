const express = require('express');
const ChatMessage = require('../models/messageModel');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the server!');
});

router.post('/', async (req, res) => {
  const { chatId, message } = req.body;

  // Wait for 1 second before sending response
  setTimeout(async () => {
    const userMessage = new ChatMessage({
      chatId,
      isUser: true,
      text: message,
      createdAt: Date.now()
    });

    const botMessage = new ChatMessage({
      chatId,
      isUser: false,
      text: `You said "${message}"`,
      createdAt: Date.now()
    });

    await Promise.all([userMessage.save(), botMessage.save()]);

    res.json({ message: `You said "${message}"` });
  }, 1000);
});

module.exports = router;