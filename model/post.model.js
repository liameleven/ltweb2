const db = require('../util/db')
const TBL_POST = "posts"

module.exports = {
    notChecked: "0",
    approved: "1",
    notApproved: "2",
    add: (post) => {
        return db.add(TBL_POST, post)
    },

}
