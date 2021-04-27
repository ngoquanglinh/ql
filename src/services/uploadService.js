let multer = require("multer");

let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./src/public/assets/uploads");
    },
    filename: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|doc|DOC|pdf|PDF|xlsx|txt|ppt|pptx|xls)$/)) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});
var upload = multer({ storage: diskStorage });

module.exports = upload;