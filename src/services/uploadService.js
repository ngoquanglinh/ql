let multer = require("multer");

let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./src/public/assets/uploads");
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg", 'image/gif', 'image/svg+xml'];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});
var upload = multer({ storage: diskStorage });

module.exports = upload;