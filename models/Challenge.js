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
  },
  show: {
    type: Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  }
}, {
  collection: 'challenges',
  timestamps: {},
  strict: true
});
schema.index({ createdAt: -1 });
module.exports = mongoose.model('Challenge', schema);