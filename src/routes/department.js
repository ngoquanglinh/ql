import express from "express";
import departmentController from "../controllers/departmentController";
import loginController from "../controllers/loginController";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let userRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, departmentController.handleGetAllDepartments);
    router.get("/lists", loginController.checkLoggedIn, departmentController.handleGetAllDepartmentsLists);
    router.delete("/:id", loginController.checkLoggedIn, departmentController.handleDeleteDepart);
    router.post("/", loginController.checkLoggedIn, departmentController.handleAddDepart);
    // router.get("/list", loginController.checkLoggedIn, departmentController.handleShowListUser);

    router.put("/", loginController.checkLoggedIn, departmentController.handleEditDepart);
    router.post("/roles", loginController.checkLoggedIn, departmentController.handleAddRoles);
    router.get("/roles/:id", loginController.checkLoggedIn, departmentController.handleListRoles);
    router.delete("/roles/:id", loginController.checkLoggedIn, departmentController.handleDeleteRoles);
    router.put("/roles/:id", loginController.checkLoggedIn, departmentController.handleEditRoles);

    router.get("/claim", loginController.checkLoggedIn, departmentController.handleGetListClaim);
    router.post("/role-claim", loginController.checkLoggedIn, departmentController.handleEditRoleClaim);

    router.get("/doc-dep/:id", loginController.checkLoggedIn, departmentController.handleGetAllDepartmentsDoc);
    router.get("/lists-user/:id", loginController.checkLoggedIn, departmentController.handleUserDepartment);

    return app.use("/department", router);
};
module.exports = userRoutes;
