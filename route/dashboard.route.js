const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.mdw')
const userModel = require('../model/users.model')

////////////ADMIN//////////////

router.get('/', (req, res) => {
    res.render('dashboard/admin', {
        layout: false,
    })
})

router.get('/big-category', (req, res) => {
    res.render('dashboard/category/big-category', {
        layout: false,
    })
})

router.get('/big-category/edit', (req, res) => {
    res.render('dashboard/category/edit-big-category', {
        layout: false,
    })
})

router.get('/small-category', (req, res) => {
    res.render('dashboard/category/small-category', {
        layout: false,
    })
})

router.get('/small-category/edit', (req, res) => {
    res.render('dashboard/category/edit-small-category', {
        layout: false,
    })
})

module.exports = router

