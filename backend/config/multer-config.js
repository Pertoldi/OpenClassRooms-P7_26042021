const multer = require("multer");
const fs = require('fs');

// Middleware config.
const MIME_TYPE_MAP = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp"
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let dir = 'images'
        if (!fs.existsSync(dir)) fs.mkdir(dir)
        callback(null, dir)
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_").split('.').join('_');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({ storage }).single("file");