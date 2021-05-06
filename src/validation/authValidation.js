import { check } from "express-validator";

let validateRegister = [
    check("email", "Email không chính xác").isEmail().trim(),

    check("password", "Mật khẩu không chính xác")
        .isLength({ min: 2 }),

    check("passwordConfirmation", "Password confirmation does not match password")
        .custom((value, { req }) => {
            return value === req.body.password
        })
];

let validateLogin = [
    check("email", "Invalid email").isEmail().trim(),

    check("password", "Invalid password")
        .not().isEmpty()
];

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin
};
