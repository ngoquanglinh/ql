import express from "express";
import initPassportLocal from "../controllers/passportLocalController";
import uploadController from "../controllers/uploadController";
import uploadMulter from "./../services/uploadService";

// Init all passport
initPassportLocal();

let router = express.Router();

let uploadRoutes = (app) => {
    router.post("/", uploadMulter.single('file'), uploadController.handleUpload);
    router.post('/multiple', uploadMulter.any(), uploadController.handleUploadMultiple);
    return app.use("/uploads", router);
};
module.exports = uploadRoutes;