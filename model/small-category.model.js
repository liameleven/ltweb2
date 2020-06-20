const db = require('../util/db')

const TBL_SCategory = 'small_category';

module.exports = {
    getAll: function () {
        return db.load(`select * from ${TBL_SCategory}`);
    },
    create: function (entity) {
        return db.add(TBL_SCategory, entity);
    },
    delete: function (id) {
        const condition = {
            sid: id
        }
        return db.del(TBL_SCategory, condition);
    },
    update: function (entity) {
        const condition = {
            sid: entity.sid
        }
        delete entity.sid;
        return db.patch(TBL_SCategory, entity, condition);
    },
    getByName: async function (name) {
        const query = `select * from ${TBL_SCategory} where name = '${name}'`
        console.log(query)
        const rows = await db.load(query)
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    getByID: async function (id) {
        const query = `select * from ${TBL_BCategory} where sid = '${id}'`
        console.log(query)
        const rows = await db.load(query)
        console.log(rows)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
}