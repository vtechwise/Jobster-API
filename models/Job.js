const mongoose = require("mongoose");
const JobScheme = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide the company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide the position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      default: "full-time",
      enum: ["full-time", "part-time", "remote"],
    },
    jobLocation: {
      type: String,
      // required: [true, 'Please input the job location'],
      default:'my city'
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobScheme);
