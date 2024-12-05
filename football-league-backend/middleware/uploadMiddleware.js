const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('.config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'StayWok3', // Specify folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'mp4'], // Allowed file formats
  },
});

const upload = multer({ storage });

module.exports = upload;
