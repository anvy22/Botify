const activityService = require('../services/activity.service');




module.exports.recentActivities = async (req, res) => {
    try {
         
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
       

        const activities = await activityService.getRecentActivities(req.user._id, req.query.order, req.query.limit);
        res.json(activities);

        
    } catch (error) {
        console.error("Error getting recent activities:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}