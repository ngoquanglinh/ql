import DBConnection from "./../configs/DBConnection";

// render dasboard
let handleDasboard = async (req, res) => {
    let lists = await getUserBydocumentary();
    return res.render("dashboard", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        user: req.user,
        title: "dashboard",
        lists
    });
};
let getUserBydocumentary = async () => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                `SELECT * ,COUNT(d.id) as total FROM users  as u
                INNER JOIN documentary as d ON  u.id = d.idSender GROUP BY u.id;`,
                async function (err, rows) {
                    if (err) {
                        reject(err)
                    }
                    var data = rows;
                    // data = await getDocumentarty(data);
                    resolve(data);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}
// let getDocumentarty = (data) => {
//     return new Promise((resolve, reject) => {
//         try {
//             data.forEach((item, index) => {
//                 DBConnection.query(`SELECT * FROM documentary WHERE id IN (${item.listId})`, function (err, rows) {
//                     if (err) {
//                         reject(err)
//                     }
//                     rows.map(x => console.log(x, "x"))
//                     item.documentarys = rows;
//                     if (index == data.length - 1) {
//                         resolve(data);
//                     }
//                 })
//             });
//         } catch (err) {
//             reject(err);
//         }
//     });
// };

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
            DBConnection.query(
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
    const item = await getDocumentaryById(result.insertId);
    return res.json({
        success: true,
        item
    })
};
let adddDocumentary = (data, userId) => {
    return new Promise((resolve, reject) => {
        try {
            var sql = "INSERT  INTO documentary (name, numberDocumentary,summary,content,idcategory,idSender,addressSending,addressSign,effectiveDate,expirationDate) VALUES ('" + data.name + "','" + data.numberDocumentary + "','" + data.summary + "','" + data.content + "','" + data.selectCategory + "','" + userId + "','" + data.addressSending + "','" + data.addressSign + "','" + data.effectiveDate + "','" + data.expirationDate + "')";
            DBConnection.query(
                sql,
                function (err, rows) {
                    if (err) {
                        console.log(err, "err");
                        reject(err)
                    }
                    console.log(rows, "rows");
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getDocumentaryById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
                'SELECT * FROM documentary', id,
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

// todo: show category
let showCategory = async (req, res) => {
    let users = await getAllCategory();
    return res.render("category", {
        layout: "layouts/main.ejs",
        extractScripts: true,
        title: "category",
        users
    });
};
let getAllCategory = () => {
    return new Promise((resolve, reject) => {
        try {
            DBConnection.query(
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
            DBConnection.query(
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
            DBConnection.query(
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
            DBConnection.query(
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
            DBConnection.query(
                'UPDATE categorydocumentary SET name=? WHERE id =?', [data.name, data.id],
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
// todo: get documentatry
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
            DBConnection.query(
                'SELECT * FROM documentary WHERE idSender=?', id,
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
    handleGetDocumentary: handleGetDocumentary
};


