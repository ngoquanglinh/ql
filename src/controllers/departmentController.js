import db from "./../configs/DBConnection";
import registerService from "../services/registerService";
import bcrypt from "bcryptjs";
// todo get all users
let handleGetAllDepartmentsLists = async (req, res) => {
    let items = await getAllDepartments();
    return res.json({
        success: true,
        items
    })
};
let getAllDepartments = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM departments',
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

// todo get all phong ban
let handleGetAllDepartments = async (req, res) => {
    let lists = await getAllDepartments();
    return res.render("department", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        title: "department",
        lists
    });
};

// todo: delete phong ban
let handleDeleteDepart = async (req, res) => {
    await deleteDepart(req.params.id);
    return res.json({
        success: true,
        id: req.params.id
    })
};
let deleteDepart = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'DELETE  FROM departments WHERE id = ?', id,
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

// todo: add phong ban
let handleAddDepart = async (req, res) => {
    let result = await createDepart(req.body);
    const user = await getDepartById(result.insertId);
    return res.json({
        success: true,
        user
    })
};
let createDepart = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'INSERT INTO departments SET ?', data,
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
let getDepartById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM departments', id,
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

// todo:edit phong ban

let handleEditDepart = async (req, res) => {
    const item = await updateDepart(req.body);
    return res.json({
        success: true,
        message: "Sửa thành công"
    })
};
let updateDepart = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'UPDATE departments SET name=? WHERE id =?', [data.name, data.id],
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

// todo : add roles

let handleAddRoles = async (req, res) => {
    const item = await addRoles(req.body);
    return res.json({
        success: true,
        message: "Thêm thành công"
    })
};
let addRoles = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'INSERT INTO roles SET ?', data,
                function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    console.log(rows);
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo: get roles
let handleListRoles = async (req, res) => {
    let items = await getRoles(req.params.id);
    console.log(items);
    return res.json({
        success: true,
        items
    })
};
let getRoles = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM roles WHERE 	departmentId = ${id}`,
                function (err, rows) {
                    if (err) reject(err);
                    if (rows.length > 0) {
                        rows.map((x, i) => {
                            db.query(
                                `SELECT * FROM clams WHERE 	roleId  = ${x.id}`,
                                function (err, rows1) {
                                    if (err) reject(err);
                                    x.claims = rows1;
                                    if (i == rows.length - 1) {
                                        resolve(rows);
                                    }
                                }
                            );
                        })
                    } else {
                        resolve(rows);
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo : delete roles
let handleDeleteRoles = async (req, res) => {
    let items = await deleteRoles(req.params.id);
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
            items
        })
    }

};
let deleteRoles = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `DELETE  FROM roles WHERE id = ${id}`,
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

// todo : edit roles
let handleEditRoles = async (req, res) => {
    let items = await editRoles(req.params.id, req.body);
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
            items
        })
    }

};
let editRoles = (id, data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `UPDATE roles SET name=? Where id=?`,
                [data.name, id],
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

// todo: get all claim

let handleGetListClaim = async (req, res) => {
    let items = await getClaim(req.params.id);
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
            items
        })
    }

};
let getClaim = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM clams`,
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
module.exports = {
    handleGetAllDepartments: handleGetAllDepartments,
    handleAddDepart: handleAddDepart,
    handleEditDepart: handleEditDepart,
    handleDeleteDepart: handleDeleteDepart,
    handleGetAllDepartmentsLists: handleGetAllDepartmentsLists,
    handleAddRoles: handleAddRoles,
    handleListRoles: handleListRoles,
    handleDeleteRoles: handleDeleteRoles,
    handleEditRoles: handleEditRoles,
    handleGetListClaim: handleGetListClaim
};


