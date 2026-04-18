const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const requireAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', contactController.createContact);

router.get('/', requireAuth, contactController.getContacts);
router.get('/stats', requireAuth, contactController.getContactStats);
router.get('/:id', requireAuth, contactController.getContactById);
router.patch('/:id', requireAuth, contactController.updateContactStatus);
router.patch('/:id/assign', requireAuth, contactController.updateAssignedTo);
router.patch(
  '/:id/details',
  requireAuth,
  contactController.updateContactDetails
);
router.post('/:id/notes', requireAuth, contactController.addNote);
router.post(
  '/:id/attachments',
  requireAuth,
  upload.single('attachment'),
  contactController.uploadAttachment
);
router.delete(
  '/:id/attachments/:attachmentId',
  requireAuth,
  contactController.deleteAttachment
);
router.delete('/:id', requireAuth, contactController.deleteContact);

module.exports = router;
