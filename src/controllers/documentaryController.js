import db from "./../configs/DBConnection";
var helpers = require('./../lib/helpers');
const socket = require('./../server');
var moment = require('moment');
import { checkAuth } from "./../validation/auth";

let handleDasboard = async (req, res) => {
    let lists = await getUserBydocumentary(req.user);
    const claims = await getClaims(req.user.id);
    const deps = await departments(req.user);
    const docNotdeps = await docNotdepartments(req.user);
    return res.render("dashboard", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        user: req.user,
        title: "dashboard",
        lists,
        helpers,
        moment: moment,
        claims,
        deps,
        docNotdeps
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
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getUserBydocumentary = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await checkAuth(user, "manage");
            let sql = "";
            if (check) {
                sql = `SELECT * , id as idSender FROM users`;
            } else {
                sql = `SELECT * , id as idSender FROM users Where id =${user.id}`;
            }
            db.query(
                sql,
                function (err, rows) {
                    if (err) reject(err);
                    var data = rows;
                    data.forEach((x, i) => {
                        db.query(
                            `SELECT *,d.createdAt as createdAt FROM documentary as d
                                INNER JOIN documentaryuser as du
                                ON d.id = du.idDocumentary
                                INNER JOIN users as u
                                ON u.id = du.iduser
                                WHERE u.id = ${x.idSender}`,
                            function (err, rows1) {
                                if (err) reject(err);
                                rows1.map(async (x) => {
                                    const tags = await getTags(x.idDocumentary);
                                    x.tags = tags;
                                })
                                x.items = rows1;
                                if (i == data.length - 1) {
                                    resolve(data);
                                }
                            });
                    });
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}
let getTags = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `Select t.id,t.name,t.code,dt.idTag  FROM documentarytags as dt INNER JOIN tags as t
                                    ON dt.idTag = t.id
                                    where idDocumentary = ${id}`,
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
let handleGetCategorys = async (req, res) => {
    let users = await getCategorys();
    return res.json({
        success: true,
        users
    })
};
let getCategorys = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                ' SELECT * FROM categorydocumentary',
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

// todo add documentary
let handleAddDocumentary = async (req, res) => {
    let result = await adddDocumentary(req.body, req.user.id);
    const item = await getDocumentaryById(result.insertId, req.user);
    if (item) {
        socket.io.emit("documentary", { action: "add", data: item });
    }
    if (result) {
        return res.json({
            success: true,
            // item
        })
    } else {
        return res.json({
            success: false,
        })
    }
};
let getDocumentaryUser = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT du.iduser FROM documentaryuser as du
                INNER JOIN documentary as d
                ON du.idDocumentary = d.id
                WHERE d.id = ${id}`,
                function (err, rows) {
                    if (err) reject(err)
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let adddDocumentary = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            var sql = `INSERT  INTO documentary (name, numberDocumentary,summary,content,idcategory,idSender,addressSending,
                addressSign,effectiveDate,expirationDate,createdAt,type,status) VALUES
                ("${data.name} "," ${data.numberDocumentary}","${data.summary}"," 
                 ${data.content}","${data.selectCategory}"," ${userId}","${data.addressSending}
                ","${data.addressSign}","${data.effectiveDate}","${data.expirationDate}","${data.calendarTomorrow}","${data.type}",${0})`;
            db.query(
                sql,
                async function (err, rows) {
                    if (err) reject(err);
                    if (data.selectUser) {
                        // const depDoc = data.selectUser.map(x => [x, rows.insertId]);
                        sql = `INSERT INTO departmentdocumentarys (	idDepartment ,idDocumentary) VALUES ("${data.selectUser}","${rows.insertId}")`;
                        db.query(
                            sql,
                            function (err, rows1) {
                                if (err) reject(err)
                            }
                        );
                        //
                        // var users = await getUserByDepartments(data.selectUser);
                        // users = users.map(x => [x.userId, rows.insertId]);
                        // sql = `INSERT INTO documentaryuser (iduser,idDocumentary) VALUES ?`;
                        // db.query(
                        //     sql,
                        //     [users],
                        //     function (err, rows1) {
                        //         if (err) reject(err)
                        //     }
                        // );
                    }

                    if (data.urlImage.length > 0) {
                        data.urlImage.map((x, index) => {
                            sql = `INSERT  INTO attachmentsdocumentary (id,idDocumentary) VALUES ("${x.id}","${rows.insertId}")`;
                            db.query(
                                sql,
                                function (err, rows2) {
                                    if (err) reject(err)
                                    if (index == data.urlImage.length - 1) {
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
let getUserByDepartments = (data) => {
    return new Promise((resolve, reject) => {
        try {
            let sql = `SELECT ur.userId From user_roles as ur
                    INNER JOIN roles as r 
                    ON r.id = ur.roleId 
                    Where  r.departmentId IN (?)`;
            db.query(
                sql, [data],
                function (err, rows) {
                    if (err) reject(err)
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getDocumentaryById = (id, user) => {
    return new Promise((resolve, reject) => {
        try {
            var sql = `SELECT d.id,d.name,d.status,d.createdAt,d.effectiveDate,d.expirationDate,d.type,dd.idDepartment FROM documentary as d
                INNER JOIN departmentdocumentarys as dd ON d.id = dd.idDocumentary
                where d.id  = ${id}`;
            db.query(
                sql, id,
                async function (err, rows) {
                    if (err) reject(err)
                    rows.forEach(async (x, i) => {
                        x.process = await getProsess(x.id, user);
                        if (i == rows.length - 1) resolve(rows[0]);
                    })
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo: show category
let showCategory = async (req, res) => {
    let users = await getAllCategory();
    const claims = await getClaims(req.user.id);
    return res.render("category", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        title: "category",
        users,
        helpers,
        user: req.user,
        claims
    });
};
let getAllCategory = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                ' SELECT * FROM categorydocumentary',
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

// todo: delete category
let handleDeleteCategory = async (req, res) => {
    let users = await deleteCategory(req.params.id);
    return res.json({
        success: true,
        id: req.params.id
    })
};
let deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'DELETE  FROM categorydocumentary WHERE id = ?', id,
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

// todo: add category
let handleAddCategory = async (req, res) => {
    let result = await createNewCategory(req.body);
    const item = await getCategoryById(result.insertId);
    return res.json({
        success: true,
        item
    })
};
let getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM categorydocumentary', id,
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
let createNewCategory = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'INSERT INTO categorydocumentary SET ?', data,
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

// todo: update category
let handleEditCategory = async (req, res) => {
    const item = await updateCategory(req.body);
    return res.json({
        success: true,
        message: "Sửa thành công"
    })
};
let updateCategory = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'UPDATE categorydocumentary SET name=? WHERE id =?', [data.name, data.id],
                function (err, rows) {
                    if (err) reject(err)
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
// todo: get documentatry by user 
let handleGetDocumentary = async (req, res) => {
    const items = await getDocumentary(req.params.id);
    return res.json({
        success: true,
        items
    })
};
let getDocumentary = (id) => {
    return new Promise((resolve, reject) => {
        try {
            var sql = `
            SELECT d.id,d.name,d.numberDocumentary,d.summary,d.content,d.idcategory,d.idSender,d.addressSending,
            d.addressSending,d.addressSign, d.status,d.effectiveDate,d.expirationDate,d.process,d.type,d.createdAt,d.updateAt,
            c.name as nameCategory FROM documentary as d
                INNER JOIN categorydocumentary as c
                ON c.id = d.idcategory 
                WHERE d.id=?`;
            db.query(
                sql, id,
                async function (err, rows) {
                    if (err) reject(err)
                    var data = rows;
                    data.map((x, index) => {
                        sql = `
                            SELECT u.id,u.username
                            FROM users as u
                            INNER JOIN documentaryuser as du
                            ON u.id = du.iduser
                            INNER JOIN documentary as d
                            ON du.idDocumentary = d.id
                            WHERE d.id = ${x.id}
                        `;
                        db.query(
                            sql,
                            function (err, rows) {
                                if (err) reject(err);
                                x.users = rows;
                            }
                        );

                        sql = `
                            SELECT a.id, a.url, a.type, a.createdAt, a.updatedAt
                            FROM attachments as a
                            INNER JOIN attachmentsdocumentary as ad
                            ON a.id = ad.id
                            INNER JOIN documentary as d
                            ON ad.idDocumentary = d.id
                            WHERE ad.idDocumentary = ${x.id}`;
                        db.query(
                            sql,
                            function (err, rows) {
                                if (err) reject(err);
                                x.images = rows;
                                if (index == data.length - 1) resolve(data);
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

// todo : delete documentary 
let handleDeleteDocumentary = async (req, res) => {
    let users = await deleteDocumentary(req.params.id);
    if (users) {
        socket.io.emit("documentary", { action: "delete", data: { id: req.params.id, users } });
    }
    return res.json({
        success: true,
        id: req.params.id
    })
};
let deleteDocumentary = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT du.iduser FROM documentaryuser as du
                INNER JOIN documentary as d
                ON du.idDocumentary = d.id
                WHERE d.id = ${id}`,
                function (err, rows) {
                    if (err) reject(err)
                    var data = rows;
                    db.query(
                        'DELETE  FROM documentary WHERE id = ?', id,
                        function (err, rows) {
                            if (err) reject(err);
                            resolve(data);
                        }
                    );
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo : edit documentary
let handleEditDocumentary = async (req, res) => {
    let users = await editDocumentary(req.body, req.params.id);
    if (req.body.type == "1") {
        await handleProgess(req.user.id, req.params.id, req.body);
    }
    const item = await getDocumentaryById(req.params.id, req.user);

    if (item) {
        socket.io.emit("documentary", { action: "edit", data: item });
    }
    return res.json({
        success: true,
        id: req.params.id
    })
};
let editDocumentary = (data, id) => {
    return new Promise((resolve, reject) => {
        try {
            var sql = `UPDATE documentary  SET name = "${data.name}",numberDocumentary="${data.numberDocumentary}",summary="${data.summary}",
                content="${data.content}",idcategory="${data.selectCategory}",addressSending="${data.addressSending}",addressSign="${data.addressSign}",
                effectiveDate="${data.effectiveDate}",expirationDate="${data.expirationDate}",type="${data.type}",status="${data.status}",
                process="${data.process}"
                 WHERE id = ${id}`;
            db.query(
                sql,
                async function (err, rows) {
                    if (err) reject(err)
                    if (data.selectUser && data.selectUser.length > 0) {

                        const users = data.selectUser.map(x => [x, id]);

                        sql = `DELETE  FROM documentaryuser WHERE idDocumentary = ${id}`;
                        db.query(
                            sql,
                            function (err, rows1) {
                                if (err) reject(err)
                            }
                        );
                        sql = `INSERT INTO documentaryuser (iduser,idDocumentary) VALUES ?`;
                        db.query(
                            sql,
                            [users],
                            function (err, rows1) {
                                if (err) reject(err)
                            }
                        );

                    }
                    if (data.selectDep) {
                        sql = `INSERT INTO departmentdocumentarys (idDocumentary,idDepartment ) VALUES  ("${id}","${data.selectDep}")`;
                        db.query(
                            sql,
                            function (err, rows1) {
                                if (err) reject(err)
                            }
                        );
                    }
                    if (data.urlImage.length > 0) {
                        data.urlImage.map((x, index) => {
                            sql = `INSERT INTO attachmentsdocumentary (id,idDocumentary) VALUES ("${x.id}","${id}")`
                            db.query(
                                sql,
                                function (err, rows2) {
                                    if (err) reject(err)
                                    if (index == data.urlImage.length - 1) resolve(rows);
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
let handleProgess = (userId, id, data) => {
    return new Promise((resolve, reject) => {
        try {
            if (data.selectUser) {
                data.selectUser.forEach(async function (item, i) {
                    let issset = await checkExitsProgess(item, id);
                    if (issset.length > 0) {
                        if (item == userId) {
                            db.query(
                                `Update progessdocumentarys as pd  SET pd.progess = ${data.process} where pd.idUser=${userId} and pd.idDocumentary=${id}`,
                                function (err, rows) {
                                    if (err) reject(err);
                                }
                            );
                        }
                    } else {
                        db.query(
                            `INSERT INTO progessdocumentarys (idUser,idDocumentary ) VALUES  ("${item}","${id}")`,
                            function (err, rows) {
                                if (err) reject(err);
                            }
                        );
                    }
                    if (i == data.selectUser.length - 1) resolve();
                })
            } else {
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
};
let checkExitsProgess = (userId, id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM progessdocumentarys as pd where pd.idUser = ${userId} and pd.idDocumentary=${id}`,
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
let getDepartmentdocumentarys = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT * FROM departmentdocumentarys as dd where dd.idDocumentary = ${id}`,
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
// todo : get attachments
let handleGetAttachments = async (req, res) => {
    let items = await getAttachments(req.params.id);
    return res.json({
        success: true,
        items
    })
};
let getAttachments = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT a.id,a.url,a.type,a.createdAt,a.updatedAt
                                            FROM attachments as a
                                            INNER JOIN attachmentsdocumentary as ad
                                            ON a.id = ad.id
                                            INNER JOIN documentary as d
                                            ON ad.idDocumentary = d.id
                                            WHERE d.id = ${id}`,
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
// todo : get users documentarys
let handleGetUsers = async (req, res) => {
    let items = await getUsersDocumentarys(req.params.id);
    return res.json({
        success: true,
        items
    })
};
let getUsersDocumentarys = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                // `SELECT u.id,u.username FROM documentaryuser as du
                //             INNER JOIN users as u
                //             ON u.id = du.iduser
                //             INNER JOIN documentary as d
                //             ON du.idDocumentary = d.id
                //             WHERE d.id = ${id}`,

                `SELECT dd.idDepartment FROM departmentdocumentarys as dd
                            INNER JOIN documentary as d
                            ON dd.idDocumentary  = d.id
                            WHERE d.id = ${id}`,
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

/// recode 

let departments = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await checkAuth(user, "manage");
            let sql = "";
            if (check) {
                sql = `SELECT *  FROM departments`;
            } else {
                sql = `SELECT d.id,d.name,d.parentId,d.parentId,d.updateAt  FROM departments as d
                INNER JOIN roles as r
                ON r.departmentId = d.id 
                INNER JOIN user_roles as ur 
                ON ur.roleId = r.id
                where ur.userId =  ${user.id} group by d.id`;
            }
            db.query(
                sql,
                function (err, rows) {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}
let docNotdepartments = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await checkAuth(user, "manage");
            let sql = "";
            if (check) {
                sql = `SELECT DISTINCT  d.id,d.name,d.status,d.effectiveDate,d.expirationDate,d.type,d.process,d.type  FROM documentary as d
                WHERE d.id NOT IN ( SELECT idDocumentary FROM departmentdocumentarys WHERE idDocumentary IS NOT NULL)`;
                db.query(
                    sql,
                    function (err, rows) {
                        if (err) reject(err);
                        resolve(rows);
                    }
                );
            } else {
                resolve([]);
            }

        } catch (err) {
            reject(err);
        }
    });
}
//////////
let handleGetUsersAssign = async (req, res) => {
    let items = await getUsersAssign(req.params.id);
    return res.json({
        success: true,
        items
    })
};
let getUsersAssign = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT u.id from users as u
                INNER JOIN documentaryuser as du
                ON u.id = du.iduser
                WHERE du.idDocumentary = ${id}`,
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
//////////
let handleGetProsess = async (req, res) => {
    let items = await getProsess(req.params.id, req.user);
    return res.json({
        success: true,
        items
    })
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

module.exports = {
    handleGetCategorys: handleGetCategorys,
    handleAddDocumentary: handleAddDocumentary,
    showCategory: showCategory,
    handleDeleteCategory: handleDeleteCategory,
    handleAddCategory: handleAddCategory,
    handleEditCategory: handleEditCategory,
    handleDasboard: handleDasboard,
    handleGetDocumentary: handleGetDocumentary,
    handleDeleteDocumentary: handleDeleteDocumentary,
    handleEditDocumentary: handleEditDocumentary,
    handleGetAttachments: handleGetAttachments,
    handleGetUsers: handleGetUsers,
    handleGetUsersAssign,
    handleGetProsess
};


