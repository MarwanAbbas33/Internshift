const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
  },
  companyId: {
    type: String,
  },
  postId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Application", applicationSchema);
