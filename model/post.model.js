const db = require('../util/db')

const TBL_POST = 'posts';
module.exports={
    add:(post)=>{
        return db.add(TBL_POST,post)
    },
}



