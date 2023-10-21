const cloudinary = require("cloudinary").v2
          
cloudinary.config({ 
  cloud_name: process.env.ClOUDNARY_CLOUD_NAME, 
  api_key: process.env.ClOUDNARY_API_KEY, 
  api_secret: process.env.ClOUDNARY_API_SECRET
});

module.exports = cloudinary