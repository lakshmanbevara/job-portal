const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Determine upload directory based on environment
let uploadDir = path.join(__dirname, '../uploads');
if (process.env.VERCEL) {
  uploadDir = os.tmpdir();
} else {
  // Ensure uploads folder exists in local development
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Save file with unique timestamp prefix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter validator rules
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only JPG, PNG images and PDF documents are allowed'));
};

// Multer upload configurations
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: fileFilter
});

module.exports = upload;
