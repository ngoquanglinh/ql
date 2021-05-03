import db from "./../configs/DBConnection";

let handleUpload = async (req, res) => {
    res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.filename,
        location: '/assets/uploads/' + req.file.filename
    });
};
let handleUploadMultiple = async (req, res) => {
    var location = await upload(req.files);
    await location.map(x => x.url = "/assets/uploads/" + x.url);
    res.status(200).send({
        sucess: true,
        message: "Uploaded the file successfully",
        location
    });
};
let upload = (files) => {
    return new Promise((resolve, reject) => {
        try {
            var arrImage = [];
            files.map((x, index) => {
                db.query(
                    `INSERT INTO  attachments (url,type) VALUES ("${x.filename}", "${x.mimetype}")`,
                    function (err, rows) {
                        if (err) reject(err)
                        db.query(
                            `SELECT * from  attachments WHERE id = "${rows.insertId}"`,
                            function (err, rows) {
                                if (err) reject(err)
                                arrImage.push(...rows);
                                if (index == files.length - 1) resolve(arrImage);
                            }
                        );
                    }
                );
            })
        } catch (err) {
            reject(err);
        }
    });
};
module.exports = {
    handleUpload: handleUpload,
    handleUploadMultiple: handleUploadMultiple
};
