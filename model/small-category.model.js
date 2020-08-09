const db = require('../util/db')

const TBL_BCategory = 'big_category';
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
        const rows = await db.load(query)        
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
    getByBID: async function (bid) {
        const query = `select * from ${TBL_SCategory} where bid = '${bid}'`        
        return await db.load(query) 
    },
}