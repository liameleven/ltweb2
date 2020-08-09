const db = require('../util/db')
const TBL_POST = "posts"
const TBL_BCategory = 'big_category';
const TBL_SCategory = 'small_category';
const TBL_Manager = 'manager';

module.exports = {
    statusPending: "0",
    statusApproved: "1",
    statusRejected: "2",
    parseStatusHTML: (status) => {
        if (status == "0") {
            return '<span class="badge badge-warning">Pending</span>'
        }
        if (status == "1") {
            return '<span class="badge badge-success">Approved</span>'
        }
        if (status == '2') {
            return '<span class="badge badge-danger">Rejected</span>'
        }
        return 'Unknown'
    },
    add: (post) => {
        return db.add(TBL_POST, post)
    },
    getAll: () => {
        return db.load(`select * from ${TBL_POST}`)
    },
    getByID: async (id) => {
        const query = `select * from ${TBL_POST} where id = ${id}`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    },
    getByStatus: () => {
        return db.load(`select * from ${TBL_POST} where status = 0`)
    },
    updateDenyPost: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_POST, entity, condition);
    },
    updateSuccessPost: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_POST, entity, condition);
    },
    getByWritter: (uid) => {
        return db.load(`select * from ${TBL_POST} where user_id=${uid}`)
    },
}