const db = require('../util/db')

const TBL_Comments = 'comments'
const TBL_Users = 'users'

module.exports = {
    add: (comment) => {
        return db.add(TBL_Comments, comment)
    },
    getByPostID: async (post_id) => {
        const query = `select c.*,u.user_name from ${TBL_Comments} c join ${TBL_Users} u on c.user_id = u.uid where post_id = ${post_id}`
        const rows = await db.load(query)
        if (rows.length === 0) {
            return null
        }
        return rows
    }
}