import express from "express";
import tagsController from "../controllers/tagsController";
import loginController from "../controllers/loginController";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let tagsRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, tagsController.home);
    router.post("/", loginController.checkLoggedIn, tagsController.post);
    router.delete("/:id", loginController.checkLoggedIn, tagsController.deleteTag);
    router.put("/:id", loginController.checkLoggedIn, tagsController.edit);
    router.get("/list", loginController.checkLoggedIn, tagsController.list);
    router.get("/tags-documentary/:id", loginController.checkLoggedIn, tagsController.tagsAssign);
    router.post("/tags-documentary", loginController.checkLoggedIn, tagsController.createAssign);
    router.delete("/tags-documentary/:id/:idDocumentary", loginController.checkLoggedIn, tagsController.removeAssign);

    return app.use("/tags", router);
};
module.exports = tagsRoutes;
