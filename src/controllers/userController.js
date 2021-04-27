import db from "./../configs/DBConnection";
import registerService from "../services/registerService";
import bcrypt from "bcryptjs";
// todo get all users
let handleGetAllUser = async (req, res) => {
    let users = await getAllUser();
    return res.json({
        success: true,
        users
    })
};
let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                ' SELECT * FROM users',
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo get all users
let handleShowListUser = async (req, res) => {
    let users = await getAllUser();
    return res.render("users", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        title: "users",
        users
    });
};

// todo: delete user
let handleDeleteUser = async (req, res) => {
    await deleteDocumentary(req.params.id);
    await deleteUser(req.params.id);
    return res.json({
        success: true,
        id: req.params.id
    })
};
let deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'DELETE  FROM users WHERE id = ?', id,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let deleteDocumentary = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'DELETE  FROM documentary WHERE idSender = ?', id,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo: add user
let handleAddUser = async (req, res) => {
    let result = await registerService.createNewUser(req.body);
    const user = await getUserById(result.insertId);
    return res.json({
        success: true,
        user
    })
};
let getUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM users', id,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows[0]);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo:edit user

let handleEditUser = async (req, res) => {
    const user = await getUserById(req.body.id);
    if (user) {
        bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
            if (hash) {
                bcrypt.compare(req.body.password, user.password, function (err, resp) {
                    if (err) {
                        return err
                    }
                    console.log(req.body.password, user.password);
                    if (resp) {
                        updateUserById(req.body.username, hash, req.body.id).then((data) => {
                            if (data > 0) {
                                return res.json({
                                    success: true,
                                    message: "Sửa thành công"
                                })
                            }
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: "Mật khẩu không chính xác"
                        })
                    }
                });
            }
        });
    } else {
        return res.json({
            success: false,
            message: "Không tồn tại user"
        })
    }
};
let updateUserById = (username, password, id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'UPDATE users SET username=?,password=? Where id=?', [username, password, id],
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    resolve(rows.affectedRows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    handleGetAllUser: handleGetAllUser,
    handleShowListUser: handleShowListUser,
    handleDeleteUser: handleDeleteUser,
    handleAddUser: handleAddUser,
    handleEditUser: handleEditUser
};


