const db = require('../util/db')
const TBL_Post = 'posts';
const TBL_Post_Tag = 'post_tag';
const TBL_Tag = 'tag';

module.exports = {
    getAll: function () {
        return db.load(`select * from ${TBL_Post_Tag}`);
    },
    create: function (entity) {
        return db.add(TBL_Post_Tag, entity);
    },
    delete: function (entity) {
        const condition = {
            post_id: +entity.post_id,
            tag_id: +entity.tag_id
        }
        return db.del(TBL_Post_Tag, condition);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_Post_Tag, entity, condition);
    },
    getAllByID: async function (id) {
        const query = `select * from ${TBL_Post_Tag} where post_id = '${id}'`
        const rows = await db.load(query)
        if (rows.length === 0)
            return null;
        return rows;
    },
    deletePostTag: async function (postid,tagid) {
        const query = `delete from ${TBL_Post_Tag} where post_id = '${postid}' and tag_id = '${tagid}'`
        await db.load(query)
    }
   
}