// Import Mongoose
const mongoose = require('mongoose');

// Define the schema
const ChatbotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a user
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    requestCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    information: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    APIKEY: {
        type: String,
        
    },
    API_URL: {
        type: String,
    
    }
  
});

// Export the model
module.exports = mongoose.model('ChatbotModel', ChatbotSchema);
