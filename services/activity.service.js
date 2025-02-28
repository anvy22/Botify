const { getRecentActivitiesAsc, getRecentActivitiesDesc, RecentActivity } = require("../models/RecentActivity.model");




// Log a recent activity
async function logActivity(userId, action, details = "") {
  try {
    const activity = new RecentActivity({ userId, action, details });
    await activity.save();
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}


async function getRecentActivities(userId, order = "desc", limit = 10) {
  if (order === "asc") {
    return getRecentActivitiesAsc(userId, limit);
  } else {
    return getRecentActivitiesDesc(userId, limit);
  }

}


module.exports = {
  logActivity,
  getRecentActivities,
};


