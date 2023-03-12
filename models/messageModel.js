const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
