const mongoose = require("mongoose");
const JobScheme = new mongoose.Schema({
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
  createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required:[true, 'Please provide user']
  },
},{timestamps:true});


module.exports = mongoose.model('Job', JobScheme)
