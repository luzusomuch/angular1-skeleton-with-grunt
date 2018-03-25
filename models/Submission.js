const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    }
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    index: true
  },
  video: {
    originalUrl: String,
    thumbnails: [String],
    proScore: {
      type: Number,
      default: 0
    },
    // likes is array of string of user
    likes: [String]
  }
}, {
  collection: 'submissions',
  timestamps: {},
  strict: true
});
schema.index({
  'user.id': 1,
  challenge: 1
}, {
  unique: true
});
module.exports = mongoose.model('Submission', schema);