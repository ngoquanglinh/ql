import db from "./../configs/DBConnection";
import registerService from "../services/registerService";
import bcrypt from "bcryptjs";
var helpers = require('./../lib/helpers');
import { checkAuth } from "./../validation/auth";
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
    const claims = await getClaims(req.user.id);
    return res.render("department", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        title: "department",
        lists,
        helpers,
        claims,
        user: req.user,
    });
};
let getClaims = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT ur.roleId FROM user_roles as ur where ur.userId = ${id}`,
                function (err, rows) {
                    if (err) reject(err);
                    if (rows.length > 0) {
                        rows = rows.map(x => { return x.roleId });
                        rows.map((item, index) => {
                            db.query(
                                `SELECT *,c.name  FROM rolesclaims as rc
                    INNER JOIN clams as c ON rc.idClaim = c.id
                    where rc.idRole = ${item}`,
                                function (err, rows1) {
                                    if (err) reject(err);
                                    if (index == rows.length - 1) resolve(rows1);
                                }
                            );
                        });
                    } else {
                        resolve([]);
                    }
                }
            )
        } catch (err) {
            reject(err);
        }
    });
};

// rows.map((x, i) => {
//     db.query(
//         `SELECT r.name FROM roles as r
//                             INNER JOIN user_roles as ur 
//                             ON r.id = ur.roleId
//                             INNER JOIN users as u
//                             ON u.id = ur.userId
//                             WHERE ur.userId = ${x.id}
//                             `,
//         function (err, rows1) {
//             if (err) reject(err);
//             x.roles = rows1;
//             if (i == rows.length - 1) resolve(rows);
//         }
//     );
// })

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
    return res.json({
        success: true,
        items
    })
};
let getRoles = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM roles WHERE departmentId = ${id}`,
                function (err, rows) {
                    if (err) reject(err);
                    if (rows.length > 0) {
                        rows.map((x, i) => {
                            db.query(
                                `SELECT c.id FROM clams as c 
                                INNER JOIN rolesclaims as rc
                                ON rc.idClaim = c.id  
                                INNER JOIN roles as r
                                ON rc.idRole = r.id
                                WHERE r.id = ${x.id}`,
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

// todo: edit role claim

let handleEditRoleClaim = async (req, res) => {
    let items = await editRolesClaims(req.body);
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
let editRolesClaims = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const claims = await getClaimsByRole(data.id);
            const claimsArr = claims.map(x => { return x.idClaim.toString() });
            const claimsRemove = claims.filter(x => !data.claims.includes(x.idClaim.toString()));
            if (claimsRemove.length > 0) {
                const claimsRemoveArr = claimsRemove.map(x => { return [x.idRole, x.idClaim] });
                await deleteClaimsByRole(claimsRemoveArr);
            }
            const claimsCreate = data.claims.filter(x => !claimsArr.includes(x));
            if (claimsCreate.length > 0) {
                const claimsCreateArr = claimsCreate.map(x => { return [data.id, x] });
                await createClaimsByRole(claimsCreateArr);
            }
            resolve(claims);
        } catch (err) {
            reject(err);
        }
    });
};
let getClaimsByRole = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM rolesclaims r where r.idRole = ${id}`,
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
let deleteClaimsByRole = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `DELETE FROM rolesclaims  where (idRole,idClaim) IN (?)`, [data],
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
let createClaimsByRole = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `INSERT INTO rolesclaims (idRole,idClaim) VALUES ?`, [data],
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
//
let handleGetAllDepartmentsDoc = async (req, res) => {
    let items = await getAllDepartmentsDoc(req.params.id, req.user);
    return res.json({
        success: true,
        items
    })
};
let getAllDepartmentsDoc = (id, user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkManage = await checkAuth(user, "manage|manageDepartment");
            let sql = '';
            if (checkManage) {
                sql = `SELECT d.id,d.name,d.status,d.createdAt,d.effectiveDate,d.expirationDate,d.type,dd.idDepartment FROM documentary as d
                INNER JOIN departmentdocumentarys as dd ON d.id = dd.idDocumentary
                order by d.createdAt desc
                where dd.idDepartment  = ${id}`;
            } else {
                sql = `SELECT d.id,d.name,d.status,d.createdAt,d.effectiveDate,d.expirationDate,d.type,dd.idDepartment FROM documentary as d
                INNER JOIN departmentdocumentarys as dd ON d.id = dd.idDocumentary
                INNER JOIN documentaryuser as du ON du.idDocumentary = d.id
                order by d.createdAt desc
                where dd.idDepartment  = ${id} and du.iduser = ${user.id}`;
            }
            db.query(
                sql,
                async function (err, rows) {
                    if (err) reject(err);
                    rows.forEach(async (x, i) => {
                        x.process = await getProsess(x.id, user);
                        if (i == rows.length - 1) resolve(rows);
                    })
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getProsess = (id, user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await checkAuth(user, "manage|manageDepartment");
            let sql = "";
            if (check) {
                sql = `SELECT pd.progess FROM progessdocumentarys pd Where 	idDocumentary  = ${id}`;
            } else {
                sql = `SELECT pd.progess FROM progessdocumentarys pd Where 	idDocumentary  = ${id} and idUser=${user.id}`;
            }
            db.query(
                sql,
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
//

let handleUserDepartment = async (req, res) => {
    let items = await handleGetUserDepartment(req.params.id);
    return res.json({
        success: true,
        items
    })
};
let handleGetUserDepartment = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT u.id,u.username FROM users as u
                INNER JOIN user_roles as ur ON u.id = ur.userId
                INNER JOIN roles as r ON ur.roleId = r.id
                where r.departmentId = ${id} group by u.id`,
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
    handleGetListClaim: handleGetListClaim,
    handleEditRoleClaim: handleEditRoleClaim,
    handleGetAllDepartmentsDoc,
    handleUserDepartment
};


