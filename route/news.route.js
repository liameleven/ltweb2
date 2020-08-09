const express = require('express')
const router = express.Router()
const config = require('../config/config.json')
const bigCategoryModel = require('../model/big-category.model')
const smallCategoryModel = require('../model/small-category.model')
const postModel = require('../model/post.model')

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

router.get('/categories', async (req, res) => {
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
    if (req.query.sid) {
        const posts = await postModel.getByBigAndSmallCateID(req.query.sid)
        return res.render('news/categories', {
            layout: 'news.hbs',
            bigCategories,
            posts
        })
    }
    const posts = await postModel.getByBigCateID(req.query.bid)
    res.render('news/categories', {
        layout: 'news.hbs',
        posts
    })
})

router.get('/post', async (req, res) => {
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
    const post = await postModel.getByID(req.query.id)
    res.render('news/post', {
        layout: 'news.hbs',
        bigCategories,
        post
    })
})

module.exports = router