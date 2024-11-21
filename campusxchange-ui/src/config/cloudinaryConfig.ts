// Cloudinary configuration with environment variables
export const CLOUDINARY_CONFIG = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dpzhwx3xh',
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'campusxchange',
};
