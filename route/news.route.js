const express = require('express')
const router = express.Router()
const config = require('../config/config.json')
const bigCategoryModel = require('../model/big-category.model')
const smallCategoryModel = require('../model/small-category.model')
const postModel = require('../model/post.model')
const tagModel = require('../model/tag-name.model')
const moment = require('moment')
const commentModel = require('../model/comment.model')

router.get('/', async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    bigCategories.forEach(big => {
        var arraySmallCate = new Array()
        smallCategories.forEach(small => {
            if (big.bid === small.bid) {
                arraySmallCate.push(small)
            }
        })
        big.smallCategories = arraySmallCate
    });
    res.render('news/main', {
        layout: 'news.hbs',
        bigCategories
    })
})

router.get('/post', async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    var post = await postModel.getByID(req.query.id)
    var relatedPosts = await postModel.get5RandomPostByBigCateID(post.bid)
    var tags = await tagModel.getPostTagByPostID(req.query.id)
    bigCategories.forEach(big => {
        var arraySmallCate = new Array()
        smallCategories.forEach(small => {
            if (big.bid === small.bid) {
                arraySmallCate.push(small)
            }
        })
        big.smallCategories = arraySmallCate
        if (big.bid === post.bid) {
            post.bigCate = big
        }
        if (relatedPosts != null) {
            relatedPosts.forEach(relatedPost => {
                if (relatedPost.bid === big.bid) {
                    relatedPost.bigCate = big
                }
            })
        }
    });
    var isLogin = req.session.isAuthenticated
    var postDate = moment(post.date).format('DD-MM-YYYY')
    var comments = await commentModel.getByPostID(req.query.id)
    if (comments != null) {
        comments.forEach(comment => {
            comment.date = moment(comment.date).format('DD-MM-YYYY hh:mm')
        })
    }

    res.render('news/post', {
        layout: 'news.hbs',
        bigCategories,
        post,
        relatedPosts,
        tags,
        isLogin,
        postDate,
        comments
    })
    delete post.bigCate
    await postModel.increaseView(post)
})

router.post('/comment', async (req, res) => {
    const comment = {
        user_id: req.session.authUser.uid,
        comment: req.body.comment,
        post_id: req.body.post_id
    }
    await commentModel.add(comment)
    res.redirect('back')
})

router.get('/tag', async (req, res) => {
    var tagid = req.query.id
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    //var posts = await postModel.getByTagID(req.query.id)
    const page = +req.query.page || 1;
    if (page < 0) page = 1
    var offset = (page - 1) * config.pagination.limit
    var posts = await postModel.pagebyTag(req.query.id, config.pagination.limit, offset)
    var total = await postModel.countbyTag(req.query.id)
    const nPages = Math.ceil(total / config.pagination.limit)
    const page_items = []

    bigCategories.forEach(big => {
        var arraySmallCate = new Array()
        smallCategories.forEach(small => {
            if (big.bid === small.bid) {
                arraySmallCate.push(small)
            }
        })
        big.smallCategories = arraySmallCate
        if (posts != null) {
            posts.forEach(async (post) => {
                if (post.bid === big.bid) {
                    post.bigCate = big
                }
                // var tags = await tagModel.getPostTagByPostID(post.id)
                // if (tags != null) {
                //     post.tags = tags
                // }
            })
        }
    });

    if (page == 1) {
        for (let i = 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page,
                tag_id: req.query.id
            }
            page_items.push(item)
        }
    }
    else {
        for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page,
                tag_id: req.query.id
            }
            page_items.push(item)
        }
    }

    res.render('news/tag', {
        layout: 'news.hbs',
        bigCategories,
        posts,
        tagid,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages

    })
})

router.get('/category', async (req, res) => {
    var bid = req.query.bid
    var have_smallcate= false
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()

    const page = +req.query.page || 1;
    if (page < 0) page = 1
    var offset = (page - 1) * config.pagination.limit

    if (req.query.sid) {
        var sid = req.query.sid
        have_smallcate=true
        var posts = await postModel.pagebySmallCate(req.query.sid, config.pagination.limit, offset)
        var total = await postModel.countbySmallCate(req.query.sid)
        const nPages = Math.ceil(total / config.pagination.limit)
        const page_items = []

        if (page == 1) {
            for (let i = 1; i <= page + 1 && i <= nPages; i++) {
                const item = {
                    value: i,
                    isActive: i === page,
                    bid: req.query.bid,
                    sid: req.query.sid
                }
                page_items.push(item)
            }
        }
        else {
            for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
                const item = {
                    value: i,
                    isActive: i === page,
                    bid: req.query.bid,
                    sid: req.query.sid
                }
                page_items.push(item)
            }
        }

        return res.render('news/category', {
            layout: 'news.hbs',
            bigCategories,
            posts,
            bid,
            sid,
            page_items,
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages,
            have_smallcate
        })
    }

    var posts = await postModel.pagebyBigCate(req.query.bid, config.pagination.limit, offset)
    var total = await postModel.countbyBigCate(req.query.bid)
    const nPages = Math.ceil(total / config.pagination.limit)
    const page_items = []
    bigCategories.forEach(big => {
        var arraySmallCate = new Array()
        smallCategories.forEach(small => {
            if (big.bid === small.bid) {
                arraySmallCate.push(small)
            }
        })
        big.smallCategories = arraySmallCate
        if (posts != null) {
            posts.forEach(async (post) => {
                if (post.bid === big.bid) {
                    post.bigCate = big
                }
                // var tags = await tagModel.getPostTagByPostID(post.id)
                // if (tags != null) {
                //     post.tags = tags
                // }
            })
        }
    });

    if (page == 1) {
        for (let i = 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page,
                bid: req.query.bid                
            }
            page_items.push(item)
        }
    }
    else {
        for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page,
                bid: req.query.bid
            }
            page_items.push(item)
        }
    }

    res.render('news/category', {
        layout: 'news.hbs',
        bigCategories,
        posts,
        bid,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages,
        have_smallcate
    })
})

module.exports = router