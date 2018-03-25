const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String
  },
  startsAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: String,
    required: true
  },
  video: {
    originalUrl: String,
    thumbnails: [String]
  },
  prizes: [{
    title: String,
    winner: String
  }],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  numberOfSubmissions: {
    type: Number,
    default: 0
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }
}, {
  collection: 'challenges',
  timestamps: {},
  strict: true
});

module.exports = mongoose.model('Challenge', schema);