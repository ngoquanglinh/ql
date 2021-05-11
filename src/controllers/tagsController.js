import db from "./../configs/DBConnection";
var helpers = require('./../lib/helpers');
const socket = require('./../server');
var moment = require('moment');
import { checkAuth } from "./../validation/auth";

let home = async (req, res) => {
    let lists = await getTags();
    const claims = await getClaims(req.user.id);
    return res.render("tag", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        user: req.user,
        title: "tags",
        helpers,
        moment: moment,
        lists,
        claims
    });
};
let getTags = () => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'SELECT * FROM tags',
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
// end get list
let list = async (req, res) => {
    let items = await getTags();
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
        })
    }
}

// todo : add tags
let post = async (req, res) => {
    let result = await create(req.body);
    if (result) {
        return res.json({
            success: true,
        })
    } else {
        return res.json({
            success: false,
        })
    }

};
let create = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'INSERT INTO tags SET ?', data,
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
let deleteTag = async (req, res) => {
    let items = await removeTag(req.params.id);
    if (items) {
        return res.json({
            success: true,
        })
    } else {
        return res.json({
            success: false,
        })
    }

};
let removeTag = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `DELETE  FROM tags WHERE id = ${id}`,
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
// todo: delete

// todo:edit tags

let edit = async (req, res) => {
    const item = await editTag(req.body, req.params.id);
    if (item) {
        return res.json({
            success: true,
        })
    } else {
        return res.json({
            success: false,
        })
    }
};
let editTag = (data, id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                'UPDATE tags SET name=?, code=? WHERE id =?', [data.name, data.code, id],
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

// tags assign

let tagsAssign = async (req, res) => {
    const items = await getTagsAssign(req.params.id);
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
        })
    }
};
let getTagsAssign = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `Select t.id,t.name,t.code,dt.idTag  FROM documentarytags as dt INNER JOIN tags as t
                ON dt.idTag = t.id
                where idDocumentary = ${id}`,
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

// todo : create assign

let createAssign = async (req, res) => {
    const items = await createTagsAssign(req.body);
    if (items) {
        socket.io.emit("tags", { action: "recives", data: { items, params: req.body } });
    }
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
        })
    }
};
let createTagsAssign = (data) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `INSERT INTO documentarytags SET ?`, data,
                function (err, rows) {
                    if (err) reject(err)
                    db.query(
                        `Select * from tags where id=${data.idTag}`,
                        function (err, rows1) {
                            if (err) reject(err)
                            resolve(rows1[0]);
                        }
                    );
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

// todo : remove assign

let removeAssign = async (req, res) => {
    const items = await removeTagsAssign(req.params.id, req.params.idDocumentary);
    if (items) {
        socket.io.emit("tags", { action: "revoke", data: { items, params: req.params } });
    }
    if (items) {
        return res.json({
            success: true,
            items
        })
    } else {
        return res.json({
            success: false,
        })
    }
};
let removeTagsAssign = (idTag, idDocumentary) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `DELETE from documentarytags where idTag = ${idTag} AND  idDocumentary = ${idDocumentary}`,
                function (err, rows) {
                    if (err) reject(err)
                    db.query(
                        `Select * from tags where id=${idTag}`,
                        function (err, rows1) {
                            if (err) reject(err)
                            resolve(rows1[0]);
                        }
                    );
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    home: home,
    post,
    deleteTag,
    edit,
    list,
    tagsAssign,
    createAssign,
    removeAssign,
};


