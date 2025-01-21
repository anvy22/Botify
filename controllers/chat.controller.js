const ChatbotModel = require('../models/chatbot.model');
const userModel = require('../models/user.model');
const promptParser = require('../services/prompt.parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const logModel = require('../models/log.model');

module.exports.createBot = async (req, res) => {    
    
    let { name, description, information } = req.body;
    
    description = promptParser(description);
    information = promptParser(information);
    const userId = req.user._id;
    try {

        const existingBot = await ChatbotModel.findOne({ userId, name });
        if (existingBot) {
            return res.status(400).json({ message: "Bot is already created" });
        }

        
        const desc = await simplyfyDescription(description);
        const info = await simplyfyInformation(information);

        const chatbot = new ChatbotModel({ userId, name, description: desc, information: info });

        const result = await chatbot.save();

        await addChatbotId(userId, result._id);

        const APIKEY = jwt.sign({ chatbotId: result._id }, process.env.JWT_SECRET);
        const API_URL = process.env.URL;
        res.status(201).json({result,API_URL,APIKEY});
    } catch (error) {
        console.error("Chatbot Creation Error:", error); // Log any errors during chatbot creation
        res.status(500).json({ message: error.message });
    }


}

 async function simplyfyDescription(description) {
    const prompt1 =`Simplyfy the the description without changing the meaning of the sentence and give back only the descrpiton and donot tell any comment.The description is :`
    const apiUrl = process.env.LLAMA_API_URL;
    const requestBody = {
        model: "llama3",
        prompt: `${prompt1}\n${description}`,
        stream: false
    };


    const response = await axios.post(apiUrl, requestBody);
    return response.data.response;

}   


async function simplyfyInformation(information) {   
   
    const prompt2 =`Simplyfy the folowing  data by removing the unnecessary information and give only the required information and donot tell any comment. The data is :`
    const apiUrl = process.env.LLAMA_API_URL;
    
    const requestBody = {
        model: "llama3",
        prompt: `${prompt2}\n${information}`,
        stream: false
    };

    
    const response = await axios.post(apiUrl, requestBody);
    return response.data.response;


}

const addChatbotId = async (userId, chatbotId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Add the chatbot ID if it doesn't already exist
        if (!user.chatbotIds.includes(chatbotId)) {
            user.chatbotIds.push(chatbotId);
            await user.save();
           
        } else {
            console.log('Chatbot ID already exists');
        }
    } catch (error) {
        console.error('Error adding chatbot ID:', error.message);
    }
};

module.exports.generateResponse = async (req, res) => {
    const { prompt, apiKey } = req.body;

    try {
        // Decode chatbot ID from API key
        const decoded = jwt.verify(apiKey, process.env.JWT_SECRET);
        const chatbotId = decoded.chatbotId;

        // Fetch chatbot details
        const chatbot = await ChatbotModel.findById(chatbotId);
        if (!chatbot) {
            return res.status(404).json({ message: 'Invalid API key.' });
        }

        // Check chatbot status
        if (chatbot.status !== 'active') {
            return res.status(403).json({ message: 'Chatbot is not active.' });
        }

        // Fetch user details
        const user = await userModel.findById(chatbot.userId);
        if (!user) {
            return res.status(404).json({ message: 'Associated user not found.' });
        }

        // Check user status and credit
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'User account is not active.' });
        }
        if (user.credit <= 0) {
            return res.status(403).json({ message: 'Insufficient credit. Please upgrade your plan.' });
        }

        // Prepare the prompt for the API request
        const prompt3 = `
            Answer the following question using only the description and information provided. 
            Make the response as short as possible. Do not give a comment or any additional information.
            The description of the product is: ${chatbot.description}.
            The information of the product is: ${chatbot.information}.
            The question is: ${prompt}
        `;

        // Send request to external API
        const apiUrl = process.env.LLAMA_API_URL;
        const requestBody = {
            model: "llama3",
            prompt: prompt3,
            stream: false
        };

        const response = await axios.post(apiUrl, requestBody);

        if (response) {
            // Log the request and response
            const log = new logModel({ chatbotId, messages: [{ message: prompt, timestamp: new Date() }] });
            await log.save();

            // Increment chatbot request count
            await ChatbotModel.findByIdAndUpdate(
                chatbot._id,
                { $inc: { requestCount: 1 } },
                { new: true }
            );

            // Update user stats (totalRequestCount and credit)
            await userModel.findByIdAndUpdate(
                user._id,
                { $inc: { totalRequestCount: 1, credit: -1 } },
                { new: true }
            );
        }

        // Return the response from the external API
        res.status(200).json({ response: response.data.response });

    } catch (error) {
        console.error('Error generating response:', error.message);
        res.status(500).json({ message: 'An error occurred while processing your request.', error: `Invalid API key` });
    }
};