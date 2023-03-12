const dotenv = require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const ChatMessage = require('../models/messageModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the server!');
});

router.post('/', async (req, res) => {
  const { chatId, message } = req.body;
  const currentUserMessage = { role: 'user', content: message };
  const userMessage = new ChatMessage({
    chatId,
    role: 'user',
    text: message,
    createdAt: Date.now()
  });

  const messages = await ChatMessage.find({ chatId }).sort({ createdAt: 1 });
  const chatLog = messages.map(message => {
    return {
      role: message.role,
      content: message.text,
    };
  });

  if (messages.length === 0) {
    const systemMessage = new ChatMessage({
      chatId,
      role: 'system',
      text: process.env.OPENAI_SYSTEM_PROMPT,
      createdAt: Date.now()
    });

    const userDefaultMessage = new ChatMessage({
      chatId,
      role: 'user',
      text: process.env.OPENAI_USER_DEFAULT_PROMPT,
      createdAt: Date.now()
    });

    await Promise.all([systemMessage.save(), userDefaultMessage.save()]);
    
    chatLog.push({
      role: "system",
      content: `${process.env.OPENAI_SYSTEM_PROMPT}`
    });
    chatLog.push({
      role: "user",
      content: `${process.env.OPENAI_USER_DEFAULT_PROMPT}`
    });
  }  

  chatLog.push(currentUserMessage);
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatLog,
    });

    if (completion.data) {
      if (completion.data.choices[0].message) {
        const botMessage = new ChatMessage({
          chatId,
          role: 'assistant',
          text: completion.data.choices[0].message.content,
          createdAt: Date.now()
        });

        await Promise.all([userMessage.save(), botMessage.save()]);

        return res.json({ message: botMessage.text });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: err.message });
  }
});

module.exports = router;