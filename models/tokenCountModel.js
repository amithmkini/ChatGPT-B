const mongoose = require('mongoose');

const tokenCountSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  numTokens: {
    type: Number,
    default: 0,
  },
});

tokenCountSchema.statics.updateTokenCount = async function (chatId, tokenCount) {
  const existingCount = await this.findOne({ chatId });
  if (existingCount) {
    existingCount.numTokens = tokenCount;
    await existingCount.save();
    return existingCount;
  } else {
    const newCount = await this.create({ chatId, numTokens: tokenCount });
    return newCount;
  }
};

const TokenCount = mongoose.model('TokenCount', tokenCountSchema);

module.exports = TokenCount;
