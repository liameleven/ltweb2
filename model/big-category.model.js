const db = require('../util/db')

const TBL_BCategory = 'big_category';
const TBL_SCategory = 'small_category';


module.exports = {
  getAll: function () {
    return db.load(`select * from ${TBL_BCategory}`);
  },
  create: function (entity) {
    return db.add(TBL_BCategory, entity);
  },
  delete: function (id) {
    const condition = {
      bid: id
    }
    db.del(TBL_SCategory, condition);
    return db.del(TBL_BCategory, condition);
  },
  update: function (entity) {
    const condition = {
      bid: entity.bid
    }
    delete entity.bid;
    return db.patch(TBL_BCategory, entity, condition);
  },
  getByName: async function (name) {
    const query = `select * from ${TBL_BCategory} where name = '${name}'`
    const rows = await db.load(query)
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  getByID: async function (id) {
    const query = `select * from ${TBL_BCategory} where bid = '${id}'`
    const rows = await db.load(query)
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  exceptByName: function (name) {
    const query = `select * from ${TBL_BCategory} where name != '${name}'`
    return db.load(query)

  },
};