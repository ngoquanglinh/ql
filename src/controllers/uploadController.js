
let handleUpload = async (req, res) => {
    res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.filename,
        location: '/assets/uploads/' + req.file.filename
    });
};
let handleUploadMultiple = async (req, res) => {
    const location = req.files.map(x => { return "/assets/uploads/" + x.filename });
    res.status(200).send({
        message: "Uploaded the file successfully",
        location
    });
};

module.exports = {
    handleUpload: handleUpload,
    handleUploadMultiple: handleUploadMultiple
};
