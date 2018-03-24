const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    password: {
      type: String,
      required: true,
      select: false
    },
    uid: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    // status for org administration, managed by admin
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    verified: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['partner', 'admin', 'sdk'],
      default: 'partner'
    }
  },
  {
    collection: 'accounts',
    timestamps: {},
    strict: true
  }
);

module.exports = mongoose.model('Account', schema);
