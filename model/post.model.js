const db = require('../util/db')
const TBL_POST = "posts"
const TBL_POST_TAG = "post_tag"
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
    update: (post) => {
        return db.patch(TBL_POST, post)
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
    updateAdminSuccessPost: function (entity) {
        const condition = {
            id: entity.id,
        }
        delete entity.id;
        return db.patch(TBL_POST, entity, condition);
    },
    updatePost: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_POST, entity, condition);
    },
    getByWriter: async (uid) => {
        const query = `select * from ${TBL_POST} where user_id=${uid} order by status,date desc`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getByGroupStatus: async (uid,status) => {
        const query = `select * from ${TBL_POST} where user_id=${uid} and status=${status} order by date desc`
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
    getByIDBrowse: async (id) => {
        const query = `select * from ${TBL_POST} where id = ${id}`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    },
    getAllByID: async (id) => {
        const query = `select * from ${TBL_POST} where id = ${id} `
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
    },
    getPostByBigCate: async (uid) => {
        const query = `SELECT p.id as postid,p.*,man.* FROM ${TBL_POST} p JOIN ${TBL_Manager} man on p.bid=man.bid WHERE man.uid = ${uid} and status = 1 and date < now() order by date desc`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    /////////////////Pagination-Category//////////////
    pagebyBigCate: async (bid, limit, offset) => {
        const query = `select * from ${TBL_POST} where bid = ${bid} and status = 1 and date < now() order by date desc, premium desc limit ${limit} offset ${offset}`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    countbyBigCate: async (bid) => {
        const row = await db.load(`select count(*) as total from ${TBL_POST} where bid = ${bid} and status = 1`)
        return row[0].total
    },
    pagebySmallCate: async (sid, limit, offset) => {
        const query = `select * from ${TBL_POST} where sid = ${sid} and status = 1 and date < now() order by date desc, premium desc limit ${limit} offset ${offset} `
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    countbySmallCate: async (sid) => {
        const row = await db.load(`select count(*) as total from ${TBL_POST} where sid = ${sid} and status = 1 and date < now()`)
        return row[0].total
    },
    /////////////////Pagination-Tag//////////////
    pagebyTag: async (tag_id, limit, offset) => {
        const query = `select * from ${TBL_POST} p join ${TBL_POST_TAG} pt on p.id = pt.post_id where pt.tag_id = ${tag_id} and p.status = 1 where status = 1 and date < now() order by premium desc limit ${limit} offset ${offset}`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    countbyTag: async (tag_id) => {
        const row = await db.load(`select count(*) as total from ${TBL_POST} p join ${TBL_POST_TAG} pt on p.id = pt.post_id where pt.tag_id = ${tag_id} and p.status = 1 and date < now()`)
        return row[0].total
    },
    getTopPosts: async () => {
        const query = `select * from ${TBL_POST} where status = 1 order by view desc limit 3`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getNewPosts: async () => {
        const query = `select * from ${TBL_POST} where status = 1 order by date desc limit 10`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getPopularPosts: async () => {
        const query = `select * from ${TBL_POST} where status = 1 and date < now() order by view desc limit 10`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getHotPosts: async () => {
        const query = `select * from ${TBL_POST} where SUBDATE(NOW(),date) <= 7 order by view desc limit 3`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    searchPost: async (searchString) => {
        const query = `SELECT * FROM ${TBL_POST} WHERE MATCH (title,content,summary) AGAINST ('${searchString}' IN NATURAL LANGUAGE MODE) and date < now() order by premium desc limit 10`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    },
    getNewestPostByBigCate: async (bid) => {
        const query = `select * from ${TBL_POST} where bid = ${bid} and status = 1 and date < now() order by date limit 1`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows[0]
    }
}
