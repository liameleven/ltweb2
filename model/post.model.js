const db = require('../util/db')
const TBL_POST = "posts"
const TBL_POST_TAG = "post_tag"

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
    getByBigCateID: async (id) => {
        const query = `select * from ${TBL_POST} where bid = ${id} and status = 1 order by date desc`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getBySmallCateID: async (sid) => {
        const query = `select * from ${TBL_POST} where sid = ${sid} and status = 1 order by date desc`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getByID: async (id) => {
        const query = `select * from ${TBL_POST} where id = ${id} and status = 1`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    },
    increaseView: async (entity) => {
        entity.view = entity.view + 1
        const condition = {
            id: entity.id,
        }
        return db.patch(TBL_POST, entity, condition)
    },
    get5RandomPostByBigCateID: (bid) => {
        const query = `select * from ${TBL_POST} where bid = ${bid} and status = 1 order by rand() limit 5`
        return db.load(query)
    },
    getByTagID: async (tag_id) => {
        const query = `select * from ${TBL_POST} p join ${TBL_POST_TAG} pt on p.id = pt.post_id where pt.tag_id = ${tag_id} and p.status = 1`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    }
}
