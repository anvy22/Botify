const userModel = require('../models/user.model');
const ChatbotModel = require('../models/chatbot.model');
const logModel = require('../models/log.model');

module.exports.getOverallAnalysis = async (req, res) => {
    try {
       
        const user = await userModel.findById(req.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const chatbots = await ChatbotModel.find({ _id: { $in: user.chatbotIds } });
        if (!chatbots) {
            return res.status(404).json({ message: 'Chatbots not found' });
        }   
        const totalChatbotCount = chatbots.length;  
        const activebots = chatbots.filter(bot => bot.status === 'active').length;
        const inactivebots = chatbots.filter(bot => bot.status === 'inactive').length;

        return res.status(200).json({
            totalChatbotCount,
            activebots,
            inactivebots,
        }); 

    }        
    catch (error) {
        console.error("Error getting analysis activities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports.getChatbotAnalysis = async (req, res) => {   

  const user = await userModel.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const chatbots = await ChatbotModel.find({ _id: { $in: user.chatbotIds } })
    .sort({ requestCount: -1 }) // Sort in decreasing order of requestCount
    .limit(10); // Limit to maximum 10 chatbots

if (!chatbots || chatbots.length === 0) {
    return res.status(404).json({ message: 'Chatbots not found' });
}

// Calculate total request count
let totalRequestCounts = chatbots.reduce((sum, chatbot) => sum + chatbot.requestCount, 0);

// Add percentage calculation for each chatbot
const chatbotsWithPercentage = chatbots.map(chatbot => {
    const percentage = totalRequestCounts > 0 ? ((chatbot.requestCount / totalRequestCounts) * 100).toFixed(2) : 0;
    return {
        botId: chatbot._id,
        name: chatbot.name,
        requestCount: chatbot.requestCount,
        requestPercentage: `${percentage}%`
    };
});

return res.status(200).json({
    chatbots: chatbotsWithPercentage,
    totalRequestCounts
});

}

module.exports.ChatbotGraphAnalysis = async (req, res) => {
    try {
        const userId = req.user;
        const { year } = req.query; // Get year from query parameter
 

        
        // Validate the year parameter
        const selectedYear = year && !isNaN(year) ? parseInt(year) : new Date().getFullYear();

        // Get all chatbot IDs for the given user
        const chatbots = await ChatbotModel.find({ userId }).select('_id');
        const chatbotIds = chatbots.map(chatbot => chatbot._id);

        if (chatbotIds.length === 0) {
            return res.json({ success: true, data: [] });
        }

        // Define start and end dates for the selected year
        const startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
        const endDate = new Date(selectedYear, 11, 31, 23, 59, 59); // December 31st of selected year

        // Find logs for the chatbots owned by the user within the selected year
        const logs = await logModel.find({
            chatbotId: { $in: chatbotIds },
            timestamp: { $gte: startDate, $lte: endDate }
        });

        // Initialize an array to count logs per month
        const monthlyCount = Array(12).fill(0);

        logs.forEach(log => {
            const monthIndex = new Date(log.timestamp).getMonth(); // Extract month (0-11)
            monthlyCount[monthIndex]++; // Increment count for that month
        });

        // Format the response
        const formattedData = monthlyCount.map((count, index) => ({
            month: `${selectedYear}-${String(index + 1).padStart(2, '0')}`,
            count,
        }));

        res.json({ success: true, data: formattedData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.ChatbotSpecificGraphAnalysis = async(req,res)=>{

    try {

        const chatbotId  = req.query.chatbotId;
        const  year = req.query.year; 
        
        console.log(year);
         // Validate the year parameter
         const selectedYear = year && !isNaN(year) ? parseInt(year) : new Date().getFullYear();
    
       // Define start and end dates for the selected year
       const startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
       const endDate = new Date(selectedYear, 11, 31, 23, 59, 59); // December 31st of selected year

    
        // Find logs for the chatbots owned by the user within the current year
        const logs = await logModel.find({
          chatbotId: { $in: chatbotId },
          timestamp: { $gte: startDate, $lte: endDate }
        });


        // Initialize an array to count logs per month
        const monthlyCount = Array(12).fill(0);
    
        logs.forEach(log => {
          const monthIndex = new Date(log.timestamp).getMonth(); // Extract month (0-11)
          monthlyCount[monthIndex]++; // Increment count for that month
        });
    
        // Format the response
        const formattedData = monthlyCount.map((count, index) => ({
          month: `${new Date().getFullYear()}-${String(index + 1).padStart(2, '0')}`,
          count,
        }));
    
        res.json({ success: true, data: formattedData });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
      }





}