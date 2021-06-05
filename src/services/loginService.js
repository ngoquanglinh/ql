import DBConnection from "../configs/DBConnection";
import bcrypt from "bcryptjs";

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await findUserByEmail(email);
        if (user) {
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(`Tài khoản hoặc mật khẩu không chính xác`);
                }
            });
        } else {
            reject(`Tài khoản "${email}" không tồn tại`);
        }
    });
};


let findUserByEmail = (email) => {
    console.log(email);
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                'SELECT * FROM `users` WHERE `email` = ?  ', email,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    console.log(rows);
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                ' SELECT * FROM `users` WHERE `id` = ?  ', id,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    let user = rows[0];
                    resolve(user);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

let comparePassword = (password, userObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            await bcrypt.compare(password, userObject.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    resolve(`Tài khoản hoặc mật khẩu không chính xác`);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleLogin: handleLogin,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword
};