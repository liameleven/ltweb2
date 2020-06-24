const db = require('../util/db')

const TBL_USERS = 'users';

module.exports = {
    Male: "1",
    Female: "2",
    Subscriber: "1",
    Writer: "2",
    Editor: "3",
    Admin: "4",
    getListByPermission: async (permission) => {
        const query = `select * from ${TBL_USERS} where permission = '${permission}'`
        const rows = await db.load(query)
        return rows
    },
    getByEmail: async (email) => {
        const query = `select * from ${TBL_USERS} where email = '${email}'`
        const rows = await db.load(query);
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    getByPseudonym: async (pseudonym) => {
        const query = `select * from ${TBL_USERS} where pseudonym = '${pseudonym}`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    create: (user) => {
        return db.add(TBL_USERS, user)
    },
    updatePremiumTime: (entity, uid) => {
        const condition = {
            uid: uid,
        }
        return db.patch(TBL_USERS, entity, condition)
    },
    /////////
    getbyCode: async (otp) => {
        const query = `select * from ${TBL_USERS} where otp = '${otp}'`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    update: async (entity, uid) => {
        const condition = {
            uid: uid
        }
        return db.patch(TBL_USERS, entity, condition);
    },
    updateotp: async (entity, uid) => {
        const condition = {
            uid: uid
        }
        return db.patch(TBL_USERS, entity, condition);
    },
    updatepass: async (entity, uid) => {
        const condition = {
            uid: uid
        }
        return db.patch(TBL_USERS, entity, condition);
    },
    getbyPW: async (password) => {
        const query = `select * from ${TBL_USERS} where password = '${password}'`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    /////////////////
    pagebyPermission: async (permission, limit, offset) => {
        return await db.load(`select * from ${TBL_USERS} where permission = '${permission}' limit ${limit} offset ${offset}`)
    },
    countbyPermission: async (permission) => {
        const row = await db.load(`select count(*) as total from ${TBL_USERS} where permission = '${permission}'`)
        return row[0].total
    }

};