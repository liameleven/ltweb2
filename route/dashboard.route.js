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
    await bigCategoryModel.delete(req.query.bid)
    res.redirect('back')
})

router.get('/small-category', async (req, res) => {
    var categories = await smallCategoryModel.getAll()
    res.render('dashboard/category/small-category', {
        layout: 'admin-dashboard.hbs',
        categories,
    })
})

router.get('/small-category/edit', (req, res) => {
    res.render('dashboard/category/edit-small-category', {
        layout: 'admin-dashboard.hbs',
    })
})

module.exports = router

