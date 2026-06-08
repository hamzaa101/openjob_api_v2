const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { InvariantError } = require('../utils/errors');

const uploadDirectory = 'uploads';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = path.extname(file.originalname);

    cb(null, `${timestamp}-${randomString}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new InvariantError('File is required to be a PDF document'));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadDocument = (req, res, next) => {
  const middleware = upload.single('document');

  middleware(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new InvariantError('File size must not exceed 5 MB'));
      }

      return next(new InvariantError(error.message));
    }

    if (error) {
      return next(error);
    }

    return next();
  });
};

module.exports = uploadDocument;