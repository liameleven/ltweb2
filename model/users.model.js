const db = require('../util/db')

const TBL_USERS = 'users';

module.exports = {
    Subscriber: "1",
    Journalist: "2",
    Editor: "3",
    Admin: "4",
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
        const query = `select * from ${TBL_USERS} where pseudonym = '${pseudonym}`
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

};