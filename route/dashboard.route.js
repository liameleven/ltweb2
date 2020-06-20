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
        layout: false,
        categories: categories,
    })
})

router.get('/big-category/edit', async (req, res) => {
    var category = await bigCategoryModel.getByID(req.query.bid)
    res.render('dashboard/category/edit-big-category', {
        layout: false,
        category
    })
})

router.post('/big-category/edit', async (req, res) => {
    await bigCategoryModel.update(req.body)
    res.redirect('/dashboard/big-category')
})

router.get('/big-category/add', (req, res) => {
    res.render('dashboard/category/add-big-category', {
        layout: false,
    })
})

router.post('/big-category/add', async (req, res) => {
    if (req.body.name === '') {
        return res.render('dashboard/category/add-big-category', {
            layout: false,
            err: "Please Fill Full Category"
        })
    }
    await bigCategoryModel.create(req.body)
    res.redirect('/dashboard/big-category')
})

router.get('/big-category/delete', async (req, res) => {
    await bigCategoryModel.delete(req.query.bid)
    res.redirect('back')
})
////////////////////////////////////////////////////
router.get('/small-category', async (req, res) => {
    var category = await smallCategoryModel.getAll()
    res.render('dashboard/category/small-category', {
        layout: false,
        category,
    })
})

router.get('/small-category/add', async (req, res) => {
    const bcategories = await bigCategoryModel.getAll()
    res.render('dashboard/category/add-small-category', {
        layout: false,
        bcategories,
    })
})

router.post('/small-category/add', async (req, res) => {
    const bcategories = await bigCategoryModel.getAll()
    if (req.body.name === '') {
        return res.render('dashboard/category/add-small-category', {
            layout: false,
            bcategories,
            err: "Pleases Fill Full Category"
        })
    }
    const category = await bigCategoryModel.getByName(req.body.bname)
    var rs = [{
        name: req.body.name,
        bid: category.bid
    }]
    await smallCategoryModel.create(rs)
    res.redirect('/dashboard/small-category')
})

router.get('/small-category/edit', async (req, res) => {
    var getscategory = await smallCategoryModel.getByID(req.query.id)
    var getbcategory = await bigCategoryModel.getByName(req.query.name)
    var bcategory = await bigCategoryModel.exceptByName(req.query.name);
    res.render('dashboard/category/edit-small-category', {
        layout: false,
        getscategory,
        getbcategory,
        bcategory

    })
})

router.post('/small-category/edit', async (req, res) => {
    if (req.body.name === '') {
        return res.redirect('dashboard/category/edit-small-category', {
            layout: false,
            err: "Pleases Fill Full Category"
        })
    }
    var category = await bigCategoryModel.getByName(req.body.bname)
    var rs = {
        id: req.body.id,
        name: req.body.name,
        bid: category.bid
    }
    await smallCategoryModel.update(rs)
    res.redirect('/dashboard/small-category')
})

router.get('/small-category/delete', async (req, res) => {
    await smallCategoryModel.delete(req.query.id)
    res.redirect('back')
})

module.exports = router

