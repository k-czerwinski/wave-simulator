const mongoose = require('mongoose');

const waveProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  amplitude: {
    type: Number,
    required: true,
    min: 0.01,
    max: 1,
  },
  speed: {
    type: Number,
    required: true,
    min: 0.1,
    max: 5,
  }
});

const waveProfileModel = mongoose.model('waveProfiles', waveProfileSchema);

waveProfileModel.findByUserId = function (userId) {
  return this.find({ userId: userId }).exec();
};
module.exports = waveProfileModel;

