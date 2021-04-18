import express from "express";
const expressLayouts = require("express-ejs-layouts");
var path = require('path');
/**
 * Config view engine for app
 */
let configViewEngine = (app) => {
    app.use(expressLayouts);
    app.set("layout", "layouts/login", "layouts/main");
    app.use(express.static(path.join(__dirname, './../public')));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
};

module.exports = configViewEngine;
