const mongoose = require('mongoose');

// Define the log schema
const logSchema = new mongoose.Schema({
  chatbotId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a Chatbot model
    required: true,
    ref: 'ChatbotModel',
  },
  messages: [
    {
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});

const LogModel = mongoose.model('Log', logSchema);

module.exports = LogModel;
