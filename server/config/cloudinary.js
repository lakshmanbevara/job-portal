const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary only if credentials are provided in env
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Uploads a local file to Cloudinary if credentials exist; otherwise returns local server URL paths.
 * @param {string} localFilePath - Path to the local file
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = async (localFilePath, folder = 'studentjobportal') => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      throw new Error('Local file not found');
    }

    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

    if (hasCloudinary) {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: folder,
        resource_type: 'auto'
      });
      
      // Clean up local temp file after cloud upload
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error('Error removing local file:', err);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } else {
      // Local fallback url path (assumes the server serves the uploads directory static assets)
      const filename = localFilePath.split(/[\\/]/).pop();
      const localUrl = `/uploads/${filename}`;
      return {
        url: localUrl,
        publicId: filename
      };
    }
  } catch (error) {
    console.error('Cloudinary Upload failed, returning local file path:', error.message);
    const filename = localFilePath.split(/[\\/]/).pop();
    return {
      url: `/uploads/${filename}`,
      publicId: filename
    };
  }
};

module.exports = { cloudinary, uploadToCloudinary };
