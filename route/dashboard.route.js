const express = require('express')
const router = express.Router()
const moment = require('moment')
const userModel = require('../model/users.model')
const bigCategoryModel = require('../model/big-category.model')
const smallCategoryModel = require('../model/small-category.model')
const tagModel = require('../model/tag-name.model')

////////////ADMIN//////////////

router.get('/', (req, res) => {
    res.render('layouts/admin-dashboard', {
        layout: false,
    })
})

router.get('/big-category', async (req, res) => {
    var categories = await bigCategoryModel.getAll()
    res.render('dashboard/category/big-category', {
        layout: 'admin-dashboard.hbs',
        categories: categories,
    })
})

router.get('/big-category/edit', async (req, res) => {
    if (req.query.bid === '') {
        res.redirect('/dashboard')
    }
    var category = await bigCategoryModel.getByID(req.query.bid)
    res.render('dashboard/category/edit-big-category', {
        layout: 'admin-dashboard.hbs',
        category
    })
})

router.post('/big-category/edit', async (req, res) => {
    await bigCategoryModel.update(req.body)
    res.redirect('/dashboard/big-category')
})

router.get('/big-category/add', (req, res) => {
    res.render('dashboard/category/add-big-category', {
        layout: 'admin-dashboard.hbs',
    })
})

router.post('/big-category/add', async (req, res) => {
    await bigCategoryModel.create(req.body)
    res.redirect('/dashboard/big-category')
})

router.get('/big-category/delete', async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    await bigCategoryModel.delete(req.query.bid)
    res.redirect('back')
})

router.get('/small-category', async (req, res) => {
    var smallCategories = await smallCategoryModel.getAll()
    var bigCategories = await bigCategoryModel.getAll()
    var mapBigCate = new Map()
    bigCategories.forEach(element => {
        mapBigCate.set(element.bid, element.name)
    });
    smallCategories.forEach(element => {
        element.bigCateName = mapBigCate.get(element.bid)
    });
    res.render('dashboard/category/small-category', {
        layout: 'admin-dashboard.hbs',
        smallCategories,
    })
})

router.get('/small-category/edit', async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    var smallCategory = await smallCategoryModel.getByID(req.query.id)
    var bigCategories = await bigCategoryModel.getAll()
    bigCategories.forEach(element => {
        if (element.bid === smallCategory.bid) {
            element.selected = true
        } else {
            element.selected = false
        }
    })
    res.render('dashboard/category/edit-small-category', {
        layout: 'admin-dashboard.hbs',
        smallCategory,
        bigCategories,
    })
})

router.post('/small-category/edit', async (req, res) => {
    await smallCategoryModel.update(req.body)
    res.redirect('/dashboard/small-category')
})

router.get('/small-category/delete', async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    await smallCategoryModel.delete(req.query.id)
    res.redirect('back')
})

router.get('/small-category/add', async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    res.render('dashboard/category/add-small-category', {
        layout: 'admin-dashboard.hbs',
        bigCategories
    })
})

router.post('/small-category/add', async (req, res) => {
    await smallCategoryModel.create(req.body)
    res.redirect('/dashboard/small-category')
})

////////TAG-NAME/////////////////////
router.get('/tag-name', async (req, res) => {
    var tag = await tagModel.getAll()
    res.render('dashboard/tag/tag-name', {
        layout: 'admin-dashboard.hbs',
        tag: tag,
    })
})

router.get('/tag-name/add', (req, res) => {
    res.render('dashboard/tag/add-tag-name', {
        layout: 'admin-dashboard.hbs',
    })
})

router.post('/tag-name/add', async (req, res) => {
    await tagModel.create(req.body)
    res.redirect('/dashboard/tag-name')
})

router.get('/tag-name/edit', async (req, res) => {
    if (!req.query.id) {
        res.redirect('/dashboard')
    }
    var tag = await tagModel.getByID(req.query.id)
    res.render('dashboard/tag/edit-tag-name', {
        layout: 'admin-dashboard.hbs',
        tag
    })
})

router.post('/tag-name/edit', async (req, res) => {
    await tagModel.update(req.body)
    res.redirect('/dashboard/tag-name')
})

router.get('/tag-name/delete', async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    await tagModel.delete(req.query.id)
    res.redirect('back')
})


///////////USERS//////////////

router.get('/subscriber', async (req, res) => {
    const users = await userModel.getListByPermission(userModel.Subscriber)
    users.forEach(user => {
        var now = moment.now()
        if (user.premium_time < now) {
            user.expired = true
        }
        if (user.premium_time >= now) {
            user.expired = false
        }
        if (user.gender == userModel.Male) {
            user.gender = "Male"
        }
        if (user.gender == userModel.Female) {
            user.gender = "Female"
        }
        var birthday = moment(user.birthday).format("DD-MM-YYYY")
        user.birthday = birthday
        var premium_time = moment.unix(user.premium_time).format("DD-MM-YYYY  hh:mm:ss")
        user.premium_time = premium_time
    })
    res.render('dashboard/user/subscriber', {
        layout: 'admin-dashboard.hbs',
        users
    })
})

router.get('/writer', async (req, res) => {
    const users = await userModel.getListByPermission(userModel.Writer)
    users.forEach(user => {
        if (user.gender == userModel.Male) {
            user.gender = "Male"
        }
        if (user.gender == userModel.Female) {
            user.gender = "Female"
        }
        var birthday = moment(user.birthday).format("DD-MM-YYYY")
        user.birthday = birthday
    })
    res.render('dashboard/user/writer', {
        layout: 'admin-dashboard.hbs',
        users
    })
})

router.get('/editor', async (req, res) => {
    const users = await userModel.getListByPermission(userModel.Editor)
    users.forEach(user => {
        if (user.gender == userModel.Male) {
            user.gender = "Male"
        }
        if (user.gender == userModel.Female) {
            user.gender = "Female"
        }
        var birthday = moment(user.birthday).format("DD-MM-YYYY")
        user.birthday = birthday
    })
    res.render('dashboard/user/editor', {
        layout: 'admin-dashboard.hbs',
        users
    })
})

module.exports = router

