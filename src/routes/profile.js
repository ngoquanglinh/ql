import express from "express";
import profileController from "../controllers/profileController";
import loginController from "../controllers/loginController";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let profileRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, profileController.home);
    // router.delete("/:id", loginController.checkLoggedIn, documentaryController.handleDeleteDocumentary);
    // router.put("/:id", loginController.checkLoggedIn, documentaryController.handleEditDocumentary);
    // router.get("/attachments/:id", loginController.checkLoggedIn, documentaryController.handleGetAttachments);
    // router.get("/users/:id", loginController.checkLoggedIn, documentaryController.handleGetUsers);
    return app.use("/profile", router);
};
module.exports = profileRoutes;