const db = require('../util/db')
const TBL_POST = "posts"

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
    }
}
