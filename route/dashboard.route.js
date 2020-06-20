const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.mdw')
const userModel = require('../model/users.model')
const bigCategoryModel = require('../model/big-category.model')
const smallCategoryModel = require('../model/small-category.model')

////////////ADMIN//////////////

router.get('/', (req, res) => {
    res.render('dashboard/admin', {
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

module.exports = router

