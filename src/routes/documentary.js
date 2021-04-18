import express from "express";
import documentaryController from "../controllers/documentaryController";
import loginController from "../controllers/loginController";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let documentaryRoutes = (app) => {
    router.get("/category-list", loginController.checkLoggedIn, documentaryController.handleGetCategorys);
    router.get("/category", loginController.checkLoggedIn, documentaryController.showCategory);
    router.delete("/category/:id", loginController.checkLoggedIn, documentaryController.handleDeleteCategory);
    router.post("/category", loginController.checkLoggedIn, documentaryController.handleAddCategory);
    // router.get("/list", loginController.checkLoggedIn, documentaryController.handleShowListCategory);
    router.put("/category", loginController.checkLoggedIn, documentaryController.handleEditCategory);


    router.post("/", loginController.checkLoggedIn, documentaryController.handleAddDocumentary);
    router.get("/:id", loginController.checkLoggedIn, documentaryController.handleGetDocumentary);
    return app.use("/documentary", router);
};
module.exports = documentaryRoutes;
