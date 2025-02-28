const mongoose = require("mongoose");

const RecentActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATED BOT", "UPDATED BOT", "DELETED BOT", "ACTIVATED BOT", "DEACTIVATED BOT", "OTHER"], // Customize as needed
    },
    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only store createdAt
  }
);

const RecentActivity = mongoose.model("RecentActivity", RecentActivitySchema);


async function getRecentActivitiesAsc(userId, limit = 10) {
  return RecentActivity.find({ userId })
    .sort({ createdAt: 1 }) // Ascending order
    .limit(limit)
    .exec();
}


async function getRecentActivitiesDesc(userId, limit = 10) {
  return RecentActivity.find({ userId })
    .sort({ createdAt: -1 }) // Descending order
    .limit(limit)
    .exec();
}

module.exports = {
  RecentActivity,
  getRecentActivitiesAsc,
  getRecentActivitiesDesc,
};
