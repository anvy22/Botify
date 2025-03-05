const ChatbotModel = require('../models/chatbot.model');
const userModel = require('../models/user.model');
const promptParser = require('../services/prompt.parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const logModel = require('../models/log.model');
const chatbotModel = require('../models/chatbot.model');
const mongoose = require('mongoose');
const { logActivity } = require('../services/activity.service');

module.exports.createBot = async (req, res) => {    
    
    let { name, description, information } = req.body;
    if(!name || !description || !information){
      return  res.status(400).json({ message:'every feild is required.'})
    }
    
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
        logActivity(userId, 'CREATED BOT', `Bot ID: ${result._id}  Bot Name: ${result.name}`);

        const APIKEY = jwt.sign({ chatbotId: result._id }, process.env.JWT_SECRET);
        const API_URL = process.env.URL;
        res.status(201).json({result,API_URL,APIKEY});
    } catch (error) {
        console.error("Chatbot Creation Error:", error); // Log any errors during chatbot creation
       return res.status(500).json({ message: error.message });
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
   
    const prompt2 =`Simplyfy the folowing  data by removing the unnecessary information donot change the meaning of the data and give only the required information and donot tell any comment. The data is :`
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

    if(!prompt || !apiKey){

        res.status(400).json({ message:'every feild is required.'})
        
    }

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
            model: "azure99/blossom-v5:4b",
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



module.exports.listBots = async (req, res) => {
    const { id: userId } = req.query;

    try {
        // Validate userId as ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        // Fetch chatbots associated with the userId
        const chatbots = await ChatbotModel.find({ userId });

        // Check if the user has any chatbots
        if (!chatbots.length) {
            return res.status(200).json({ message: 'No chatbots found for this user.' });
        }

        res.status(200).json(chatbots);
    } catch (error) {
        console.error('Error fetching chatbots:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching chatbots.' });
    }
};

module.exports.getBot = async (req, res) => {
   
    const chatbotId = req.params.id; 
    try {
        const chatbot = await ChatbotModel.findById(chatbotId);
        if (!chatbot) { 
            return res.status(404)
            .json({ message: 'Chatbot not found.' });
        }
        res.status(200).json(chatbot);
    } catch (error) {
        console.error('Error fetching chatbot:', error.message);
        res.status(400).json({ message: 'An error occurred while fetching chatbot.' });
    }

}

module.exports.updateBot = async (req,res) =>{

    let { name, description, information,chatbotId } = req.body;

    if(!name || !description || !information || !chatbotId ){
        return res.status(400).json({ message: 'Every field is required.' });
    }

     // Validate chatbotId format
     if (!mongoose.Types.ObjectId.isValid(chatbotId)) {
        return res.status(400).json({ message: 'Invalid chatbot ID format.' });
    }
   
    try {

         
    const chatBot = await ChatbotModel.findById(chatbotId);
          if (!chatBot) { 
                return res.status(404)
                .json({ message: 'Chatbot not found.' });
           }

 

 
       description = promptParser(description);
       information = promptParser(information);
      

        
        const desc = await simplyfyDescription(description);
        const info = await simplyfyInformation(information);

        const updatedChatbot = await ChatbotModel.findByIdAndUpdate(
            chatbotId,
            { name, description: desc, information: info },
            { new: true } // Return updated chatbot
        );

        logActivity(req.user._id, 'UPDATED BOT', `Bot ID: ${chatbotId} Bot Name: ${name}`);

        res.status(200).json({ message: 'Chatbot Updated.', chatbot: updatedChatbot });

    } catch (error) {
        console.error("Chatbot Update Error:", error);
        res.status(500).json({ message: 'An error occurred while updating the chatbot.' });
    }
};

 
module.exports.deleteBot = async (req, res) => {
    const { botId } = req.body;

    // Validate botId existence and format
    if (!botId || !mongoose.Types.ObjectId.isValid(botId)) {
        return res.status(400).json({ message: 'Invalid or missing Bot ID.' });
    }

    try {
        // Find and delete the bot
        const deletedBot = await ChatbotModel.findByIdAndDelete(botId);

        if (!deletedBot) {
            return res.status(404).json({ message: 'Chatbot not found.' });
        }

        logActivity(req.user._id, 'DELETED BOT', `Bot ID: ${botId} Bot Name: ${deletedBot.name}`);

        res.status(200).json({ message: 'Chatbot deleted successfully.' });
    } catch (error) {
        console.error("Error while deleting the chatbot:", error);
        res.status(500).json({ message: 'An error occurred while deleting the chatbot.' });
    }
};



module.exports.activateBot = async (req, res) => {
    const { chatbotId, status } = req.body;

    // Validate chatbotId existence and format
    if (!chatbotId || !mongoose.Types.ObjectId.isValid(chatbotId)) {
        return res.status(400).json({ message: 'Invalid or missing chatbot ID.' });
    }

    // Validate status value
    if (!status || !['activate', 'deactivate'].includes(status)) {
        return res.status(400).json({ message: 'Invalid or missing status value.' });
    }

    try {
        const chatbot = await ChatbotModel.findById(chatbotId);
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found.' });
        }

        // Ensure req.user exists before checking authorization
        if (!req.user || chatbot.userId.toString() !== req.user._id.toString()) {
            console.log(`Unauthorized access attempt: Chatbot Owner: ${chatbot.userId}, Request User: ${req.user?._id}`);
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update chatbot status
        const updatedChatbot = await ChatbotModel.findByIdAndUpdate(
            chatbotId,
            { status: status === 'activate' ? 'active' : 'inactive' },
            { new: true }
        );

        logActivity(req.user._id, status === 'activate' ? 'ACTIVATED BOT' : 'DEACTIVATED BOT', `Bot ID: ${chatbotId} Bot Name: ${updatedChatbot.name}`);

        res.status(200).json({ 
            message: `Chatbot ${status === 'activate' ? 'activated' : 'deactivated'} successfully.`,
            chatbot: updatedChatbot 
        });

    } catch (error) {
        console.error("Error while updating chatbot status:", error);
        res.status(500).json({ message: 'An error occurred while updating chatbot status.' });
    }
};


module.exports.getLogs = async (req, res) => {
    try {
        const botId = req.query.botId;

        if (!botId || !mongoose.Types.ObjectId.isValid(botId)) {
            return res.status(400).json({ message: 'Invalid or missing chatbot ID.' });
        }

        const chatbot = await ChatbotModel.findById(botId);
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found.' });
        }

        if (chatbot.userId.toString() !== req.user._id.toString()) {
            console.log("Unauthorized access");
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const logs = await logModel.find({ chatbotId: botId });

        if (!logs.length) {
            return res.status(200).json({ message: 'No logs found for this chatbot.' });
        }

        return res.status(200).json(logs);

    } catch (error) {
        console.error("Error while fetching logs:", error);
        res.status(500).json({ message: 'An error occurred while fetching logs.' });
    }
};

module.exports.getUserLog = async (req, res) => {
    const userId = req.user._id;

    try {
        const chatbots = await chatbotModel.find({ userId });
        if (!chatbots.length) {
            return res.status(404).json({ message: 'No chatbots found for this user.' });
        }

        const chatbotIds = chatbots.map(chatbot => chatbot._id);

        const logs = await logModel.find({ chatbotId: { $in: chatbotIds } });

        if (!logs.length) {
            return res.status(200).json({ message: 'No logs found for this user.' });
        }
       
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching logs.' });
    }
}

