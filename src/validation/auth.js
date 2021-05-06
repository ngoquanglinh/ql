import db from "./../configs/DBConnection";
let checkAuth = (user, caps) => {
    return new Promise(async (resolve, reject) => {
        try {
            caps = caps.split(/\||,|;/);
            const roles = await getRoles(user.id);
            if (roles.length > 0) {
                var claims = await getClaims(roles);
                if (claims.length == 0) resolve(false);
                for (let i = 0; i <= claims.length - 1; i++) {
                    if (caps.indexOf(claims[i].name) != -1) {
                        resolve(true);
                    }
                }
                resolve(false)
            } else {
                resolve(false)
            }
        } catch (err) {
            resolve(false)
        }
    });
};
let getRoles = (id) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(
                `SELECT ur.roleId FROM user_roles as ur where ur.userId = ${id}`,
                function (err, rows) {
                    if (err) reject(err);
                    rows = rows.map(x => { return x.roleId });
                    resolve(rows);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};
let getClaims = (roles) => {
    return new Promise((resolve, reject) => {
        try {
            roles.map((item, index) => {
                db.query(
                    `SELECT *,c.name  FROM rolesclaims as rc
                    INNER JOIN clams as c ON rc.idClaim = c.id
                    where rc.idRole = ${item}`,
                    function (err, rows) {
                        if (err) reject(err);
                        if (index == roles.length - 1) resolve(rows);
                    }
                );
            });
        } catch (err) {
            reject(err);
        }
    });
};
module.exports = {
    checkAuth: checkAuth,
};