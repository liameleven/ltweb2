const db = require('../util/db');

const TBL_BCategory = 'big_category';
const TBL_Manager = 'manager';


/////////////Manager-Editor/////////////
module.exports = {
    getAll: function () {
        return db.load(`select * from ${TBL_Manager}`);
    },
    create: function (entity) {
        return db.add(TBL_Manager, entity);
    },
    delete: function (id) {
        const condition = {
            bid: id
        }
        return db.del(TBL_Manager, condition);
    },
    update: function (entity) {
        const condition = {
            bid: entity.bid
        }
        delete entity.bid;
        return db.patch(TBL_Manager, entity, condition);
    },
    getListByIDManager: async function (uid) {
        return db.load(`select m.uid,bc.name from ${TBL_Manager} m join ${TBL_BCategory} bc on m.bid=bc.bid where m.uid='${uid}'`);
    },
    getByID: async function (uid) {
        const query = `select * from ${TBL_Manager} where uid = '${uid}'`
        return await db.load(query)
    },
}