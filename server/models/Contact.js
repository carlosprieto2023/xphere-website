const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'created',
        'status_changed',
        'assigned',
        'note_added',
        'file_uploaded',
        'details_updated',
        'scheduled',
        'report_sent',
      ],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

const attachmentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: String,
      default: 'admin',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'quoted',
        'scheduled',
        'inspection_in_progress',
        'report_in_progress',
        'report_sent',
        'closed',
      ],
      default: 'new',
    },

    assignedTo: {
      type: String,
      trim: true,
      default: '',
    },

    serviceType: {
      type: String,
      enum: [
        'vehicle_appraisal',
        'pre_purchase_inspection',
        'condition_report',
        'dealer_inspection',
        'fleet_inspection',
        'other',
      ],
      default: 'other',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    leadSource: {
      type: String,
      enum: [
        'website',
        'email',
        'phone',
        'referral',
        'dealer',
        'auction',
        'other',
      ],
      default: 'website',
    },

    scheduledDate: {
      type: Date,
      default: null,
    },

    inspectionDate: {
      type: Date,
      default: null,
    },

    reportDueDate: {
      type: Date,
      default: null,
    },

    reportSentDate: {
      type: Date,
      default: null,
    },

    clientCompany: {
      type: String,
      trim: true,
      default: '',
    },

    customerCategory: {
      type: String,
      enum: [
        'manheim',
        'adesa',
        'openlane',
        'americas_auto_auction',
        'public_reports',
        'other',
      ],
      default: 'other',
    },

    customerGroup: {
      type: String,
      trim: true,
      default: '',
    },

    customerBrand: {
      type: String,
      trim: true,
      default: '',
    },

    customerLocation: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      trim: true,
      default: '',
    },

    quoteAmount: {
      type: Number,
      default: null,
    },

    notes: [noteSchema],
    activities: [activitySchema],
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);
