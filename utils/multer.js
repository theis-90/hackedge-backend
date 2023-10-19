const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "blogImage") {
            cb(null, './upload/blogImage/')
        } else if (file.fieldname == "productImage") {
            cb(null, './upload/productImage/')
        }else if (file.fieldname == "deviceImage") {
            cb(null, './upload/deviceImage/')
        }
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: async (req, file, cb) => {
        if (!file) {
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    }
});

module.exports = { upload } 
