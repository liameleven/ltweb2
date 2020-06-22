const db = require('../util/db')

const TBL_Tag = 'tag';

module.exports = {
    getAll: function () {
        return db.load(`select * from ${TBL_Tag}`);
    },
    create: function (entity) {
        return db.add(TBL_Tag, entity);
    },
    delete: function (id) {
        const condition = {
            id: id
        }
        return db.del(TBL_Tag, condition);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_Tag, entity, condition);
    },
    getByName: async function (name) {
        const query = `select * from ${TBL_Tag} where name = '${name}'`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows[0];
    },
    getByID: async function (id) {
        const query = `select * from ${TBL_Tag} where id = '${id}'`        
        const rows = await db.load(query)        
        if (rows.length === 0)
            return null;
        return rows[0];
    },
}