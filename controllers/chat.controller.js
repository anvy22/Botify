const ChatbotModel = require('../models/chatbot.model');
const userModel = require('../models/user.model');
const promptParser = require('../services/prompt.parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');

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