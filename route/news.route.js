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
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    var posts = await postModel.getByTagID(req.query.id)
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
    res.render('news/tag', {
        layout: 'news.hbs',
        bigCategories,
        posts
    })
})

router.get('/category', async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    if (req.query.sid) {
        const posts = await postModel.getBySmallCateID(req.query.sid)
        return res.render('news/category', {
            layout: 'news.hbs',
            bigCategories,
            posts
        })
    }
    const posts = await postModel.getByBigCateID(req.query.bid)
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
    res.render('news/category', {
        layout: 'news.hbs',
        bigCategories,
        posts
    })
})

module.exports = router