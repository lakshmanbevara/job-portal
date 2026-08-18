const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    permissions: [{
      type: String,
      default: 'all'
    }],
    managedActions: [{
      action: String,
      target: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Admin', AdminSchema);
