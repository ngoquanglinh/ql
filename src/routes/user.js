import express from "express";
import userController from "../controllers/userController";
import loginController from "../controllers/loginController";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let userRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, userController.handleGetAllUser);
    router.delete("/:id", loginController.checkLoggedIn, userController.handleDeleteUser);
    router.post("/", loginController.checkLoggedIn, userController.handleAddUser);
    router.get("/list", loginController.checkLoggedIn, userController.handleShowListUser);
    router.put("/", loginController.checkLoggedIn, userController.handleEditUser);
    router.get("/department/:id", loginController.checkLoggedIn, userController.handleGetDepByUser);
    router.put("/profile/:id", loginController.checkLoggedIn, userController.handleEditProfile);
    router.put("/password/:id", loginController.checkLoggedIn, userController.handleEditPassword);

    return app.use("/user", router);
};
module.exports = userRoutes;
