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

router.get('/category', (req, res) => {
    res.render('dashboard/category', {
        layout: false,
    })
})

module.exports = router

