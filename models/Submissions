const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
      select: false
    },
    startsAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: String,
      required: true
    },
    videoUrls: [{
      url: String,
      thumbnail: String
    }],
    prizes: [{
      title: String
    }],
    // status for org administration, managed by admin
    status: {
      type: String,
      enum: ['open', 'close'],
      default: 'opem'
    },
    numberOfSubmissions: {
      type: Number,
      default: 0
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  },
  {
    collection: 'challenges',
    timestamps: {},
    strict: true
  }
);

module.exports = mongoose.model('Challenge', schema);
