const Contact = require('../models/Contact');
const sendInquiryEmail = require('../utils/sendInquiryEmail');
const cloudinary = require('../config/cloudinary');

const SERVICE_TYPES = [
  'pre_purchase',
  'auction',
  'dealer',
  'fleet',
  'appraisal',
  'other',
];

async function createContact(req, res) {
  try {
    const {
      name,
      email,
      phone,
      message,
      serviceType,
      location,
      serviceTypeDetail,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required.',
      });
    }

    const resolvedServiceType = SERVICE_TYPES.includes(serviceType)
      ? serviceType
      : 'other';

    const trimmedDetail =
      typeof serviceTypeDetail === 'string' ? serviceTypeDetail.trim() : '';

    if (resolvedServiceType === 'other' && !trimmedDetail) {
      return res.status(400).json({
        message:
          'Please describe your inspection type when selecting Other.',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      message,
      location: typeof location === 'string' ? location.trim() : '',
      leadSource: 'website',
      serviceType: resolvedServiceType,
      serviceTypeDetail: trimmedDetail,
      priority: 'medium',
      customerCategory: 'other',
      activities: [
        {
          type: 'created',
          text: 'Inquiry was created from website form.',
          createdBy: 'system',
        },
      ],
    });

    try {
      await sendInquiryEmail(contact);
    } catch (emailError) {
      console.error('Email notification failed:', emailError.message);
    }

    res.status(201).json({
      message: 'Inquiry submitted successfully.',
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while submitting inquiry.',
      error: error.message,
    });
  }
}

async function getContacts(req, res) {
  try {
    const {
      search = '',
      status = 'all',
      customerCategory = 'all',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate = '',
      endDate = '',
    } = req.query;

    const query = {};

    if (status !== 'all') {
      query.status = status;
    }

    if (customerCategory !== 'all') {
      query.customerCategory = customerCategory;
    }

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (currentPage - 1) * pageSize;

    const allowedSortFields = ['createdAt', 'name', 'status'];
    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 1 : -1;

    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort({ [safeSortBy]: safeSortOrder })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      contacts,
      pagination: {
        total,
        page: currentPage,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching inquiries.',
      error: error.message,
    });
  }
}

async function getContactStats(req, res) {
  try {
    const {
      search = '',
      customerCategory = 'all',
      startDate = '',
      endDate = '',
    } = req.query;

    const query = {};

    if (customerCategory !== 'all') {
      query.customerCategory = customerCategory;
    }

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const monthQuery = {
      ...query,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    };

    const [
      newCount,
      scheduledCount,
      inspectionInProgressCount,
      closedCount,
      totalThisMonth,
    ] = await Promise.all([
      Contact.countDocuments({ ...query, status: 'new' }),
      Contact.countDocuments({ ...query, status: 'scheduled' }),
      Contact.countDocuments({
        ...query,
        status: 'inspection_in_progress',
      }),
      Contact.countDocuments({ ...query, status: 'closed' }),
      Contact.countDocuments(monthQuery),
    ]);

    res.status(200).json({
      new: newCount,
      scheduled: scheduledCount,
      inspectionInProgress: inspectionInProgressCount,
      closed: closedCount,
      totalThisMonth,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching stats.',
      error: error.message,
    });
  }
}

async function getContactById(req, res) {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while fetching inquiry details.',
      error: error.message,
    });
  }
}

async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'new',
      'contacted',
      'quoted',
      'scheduled',
      'inspection_in_progress',
      'report_in_progress',
      'report_sent',
      'closed',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value.',
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    const previousStatus = contact.status;
    contact.status = status;

    contact.activities.unshift({
      type: 'status_changed',
      text: `Status changed from ${previousStatus} to ${status}.`,
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while updating inquiry.',
      error: error.message,
    });
  }
}

async function updateAssignedTo(req, res) {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    const previousAssignedTo = contact.assignedTo || 'Unassigned';
    const nextAssignedTo = assignedTo || 'Unassigned';

    contact.assignedTo = assignedTo;

    contact.activities.unshift({
      type: 'assigned',
      text: `Assignment changed from ${previousAssignedTo} to ${nextAssignedTo}.`,
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while updating assigned user.',
      error: error.message,
    });
  }
}

async function updateContactDetails(req, res) {
  try {
    const { id } = req.params;
    const {
      serviceType,
      serviceTypeDetail,
      priority,
      leadSource,
      scheduledDate,
      inspectionDate,
      reportDueDate,
      reportSentDate,
      clientCompany,
      customerCategory,
      customerGroup,
      customerBrand,
      customerLocation,
      location,
      quoteAmount,
    } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    contact.serviceType = serviceType ?? contact.serviceType;
    if (serviceTypeDetail !== undefined) {
      contact.serviceTypeDetail =
        typeof serviceTypeDetail === 'string' ? serviceTypeDetail.trim() : '';
    }
    contact.priority = priority ?? contact.priority;
    contact.leadSource = leadSource ?? contact.leadSource;
    contact.scheduledDate = scheduledDate || null;
    contact.inspectionDate = inspectionDate || null;
    contact.reportDueDate = reportDueDate || null;
    contact.reportSentDate = reportSentDate || null;
    contact.clientCompany = clientCompany ?? contact.clientCompany;
    if (customerCategory !== undefined) {
      contact.customerCategory = customerCategory;
    }
    contact.customerGroup = customerGroup ?? contact.customerGroup;
    contact.customerBrand = customerBrand ?? contact.customerBrand;
    contact.customerLocation = customerLocation ?? contact.customerLocation;
    contact.location = location ?? contact.location;
    contact.quoteAmount =
      quoteAmount === '' || quoteAmount === null || quoteAmount === undefined
        ? null
        : Number(quoteAmount);

    contact.activities.unshift({
      type: 'details_updated',
      text: 'Operational details were updated.',
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while updating inquiry details.',
      error: error.message,
    });
  }
}

async function addNote(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: 'Note text is required.',
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    contact.notes.unshift({
      text,
      createdBy: req.user?.email || 'admin',
    });

    contact.activities.unshift({
      type: 'note_added',
      text: 'A new internal note was added.',
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: 'Server error while adding note.',
      error: error.message,
    });
  }
}

async function uploadAttachment(req, res) {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded.',
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    const fileBase64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'xphere-inquiries',
      resource_type: 'auto',
    });

    contact.attachments.unshift({
      fileName: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileType: req.file.mimetype,
      uploadedBy: req.user?.email || 'admin',
    });

    contact.activities.unshift({
      type: 'file_uploaded',
      text: `File uploaded: ${req.file.originalname}`,
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    console.error('UPLOAD ATTACHMENT ERROR:', error);
    res.status(500).json({
      message: 'Server error while uploading attachment.',
      error: error.message,
    });
  }
}

async function deleteAttachment(req, res) {
  try {
    const { id, attachmentId } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    const attachment = contact.attachments.id(attachmentId);

    if (!attachment) {
      return res.status(404).json({
        message: 'Attachment not found.',
      });
    }

    const deletedFileName = attachment.fileName;

    contact.attachments.pull(attachmentId);

    contact.activities.unshift({
      type: 'file_uploaded',
      text: `Attachment deleted: ${deletedFileName}`,
      createdBy: req.user?.email || 'admin',
    });

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    console.error('DELETE ATTACHMENT ERROR:', error);
    res.status(500).json({
      message: 'Failed to delete attachment',
      error: error.message,
    });
  }
}

async function deleteContact(req, res) {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        message: 'Inquiry not found.',
      });
    }

    res.status(200).json({
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error while deleting inquiry.',
      error: error.message,
    });
  }
}

module.exports = {
  createContact,
  getContacts,
  getContactStats,
  getContactById,
  updateContactStatus,
  updateAssignedTo,
  updateContactDetails,
  addNote,
  uploadAttachment,
  deleteAttachment,
  deleteContact,
};
