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
        user,
        departments
    })
};
let getUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM users', id,
                function (err, rows) {
                    if (err) reject(err)
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
        // if (req.body.password) {
        //     bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
        //         if (hash) {
        //             bcrypt.compare(req.body.password, user.password, function (err, resp) {
        //                 if (err) {
        //                     return res.json({
        //                         success: false,
        //                         message: "Mật khẩu không chính xác"
        //                     })
        //                 };
        //                 if (resp) {
        //                     updateUserById(req.body.username, hash, req.body.id);
        //                 } else {
        //                     return res.json({
        //                         success: false,
        //                         message: "Mật khẩu không chính xác"
        //                     })
        //                 }
        //             });
        //         }
        //     });
        // }
        const roles = await getListRolesUser(req.body.id);
        const rolesArr = roles.map(x => { return x.roleId.toString() });
        const rolesAdd = req.body.roles.filter(x => !rolesArr.includes(x));
        if (rolesAdd.length > 0) {
            const data = rolesAdd.map(x => { return [x, req.body.id] });
            await createRolesUser(data);
        }
        const rolesRemove = rolesArr.filter(x => !req.body.roles.includes(x));
        if (rolesRemove.length > 0) {
            const data = rolesRemove.map(x => { return [x, req.body.id] });
            await deleteRolesUser(data);
        }
        return res.json({
            success: true,
            message: "Sửa thành công"
        })
    } else {
        return res.json({
            success: false,
            message: "Không tồn tại user"
        })
    }
};
let createRolesUser = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `INSERT INTO user_roles (roleId,userId) VALUES ?`, [data],
                function (err, rows) {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let deleteRolesUser = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `DELETE FROM user_roles  where (roleId,userId) IN (?)`, [data],
                function (err, rows) {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getListRolesUser = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `select roleId from user_roles where userId = ${id}`,
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
// todo : get all department
let handleGetDepByUser = async (req, res) => {
    const items = await getAllDepartments();
    const roles = await getRolesUser(req.params.id);
    return res.json({
        success: true,
        items,
        roles
    })
};
let getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM departments',
                function (err, rows) {
                    if (err) reject(err);
                    rows.map((x, i) => {
                        db.query(
                            `SELECT * FROM roles where departmentId = ${x.id}`,
                            function (err, rows1) {
                                if (err) reject(err)
                                x.roles = rows1;
                                if (i == rows.length - 1) {
                                    resolve(rows);
                                }
                            }
                        );
                    })
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getRolesUser = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT roleId FROM user_roles where userId = ${id}`,
                function (err, rows) {
                    if (err) reject(err);
                    const data = rows.map(x => { return x.roleId });
                    resolve(data);
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
    handleEditUser: handleEditUser,
    handleGetDepByUser: handleGetDepByUser
};


