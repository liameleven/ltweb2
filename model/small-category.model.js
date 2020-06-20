const db = require('../util/db')

const TBL_SCategory = 'small_category';
const TBL_BCategory = 'big_category';


module.exports = {
    getAll: function () {
        return db.load(`SELECT sc.id AS id,sc.name AS sname,bc.name AS bname,bc.bid AS bid FROM ${TBL_SCategory} sc join ${TBL_BCategory} bc on sc.bid=bc.bid`)
    },
    create: function (entity) {
        return db.add(TBL_SCategory, entity);
    },
    delete: function (id) {
        const condition = {
            id: id
        }
        return db.del(TBL_SCategory, condition);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
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
        const query = `select * from ${TBL_SCategory} where id = '${id}'`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows[0];
    },


}