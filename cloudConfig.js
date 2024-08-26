// Cloud storage configuration file


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Config the cloudinary account with this server --> (By default set this three name as it is as shown here when confiure the cloudinary account with the server)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


// Define the storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'nestquest_DEV', // Define the folder name where the file will store
      allowedFormat: ["png", "jpg", "jpeg", "webp"], // pass the file format that this cloud storage would allow
    },
});


// finally exports cloudinary and the storage that define above (require it in listing.js in router folder)
module.exports = {
   cloudinary,
   storage
};