import registerService from "./../services/registerService";
import { validationResult } from "express-validator";
import db from "./../configs/DBConnection";

let getPageRegister = (req, res) => {
    return res.render("register.ejs", {
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/register");
    }

    //create a new user
    let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    try {
        await registerService.createNewUser(newUser);
        return res.redirect("/login");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/register");
    }
};
let initSystem = async (req, res) => {
    var sql = "INSERT INTO clams (name) VALUES ?";
    var claim = [
        ['post'],
        ['put'],
        ['delete'],
        ['get'],
        ['manager'],
        ['view']
    ];
    db.query(
        sql, [claim],
        function (err, rows) {
            if (err) {
                res.send(err);
            }
            res.send("ok");
        }
    );
    //create a new user
    let newUser = {
        username: "systemadmin",
        email: "systemadmin@gmail.com",
        password: "123456"
    };
    try {
        await registerService.createNewUser(newUser);
        res.send("ok");
    } catch (err) {
        res.send("error");
    }

};
module.exports = {
    getPageRegister: getPageRegister,
    createNewUser: createNewUser,
    initSystem: initSystem
};
