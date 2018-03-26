const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String
  },
  video: {
    originalUrl: String,
    thumbnails: [String]
  },
  numberOfChallenges: {
    type: Number,
    default: 0
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
}, {
  collection: 'shows',
  timestamps: {},
  strict: true
});
schema.index({ createdAt: -1 });
module.exports = mongoose.model('Show', schema);