const db = require('../util/db')

const TBL_USERS = 'users';

module.exports = {
    getByEmail: async (email) => {
        const query = `select * from ${TBL_USERS} where email = '${email}'`
        console.log(query)
        const rows = await db.load(query);
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    getByPseudonym: async (pseudonym) => {
        const query=`select * from ${TBL_USERS} where pseudonym = '${pseudonym}`
        console.log(query)
        const rows = await db.load(query)
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    create: (user) => {
        return db.add(TBL_USERS, user)
    },
    /////////
    getbyCode: async (otp) => {
        const query=`select * from ${TBL_USERS} where otp = '${otp}'`
        console.log(query)
        const rows = await db.load(query)
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    update: async (entity,uid) =>{
        const condition={
            uid:uid
        }
        return db.patch(TBL_USERS,entity,condition);
    },
    updateotp: async (entity,uid) =>{
        const condition={
            uid:uid
        }
        return db.patch(TBL_USERS,entity,condition);
    },
    updatepass: async (entity,uid)=>
    {
        const condition={
            uid:uid
        }
        return db.patch(TBL_USERS,entity,condition);
    },
    getbyPW: async (password) => {
        const query=`select * from ${TBL_USERS} where password = '${password}'`
        console.log(query)
        const rows = await db.load(query)
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
};