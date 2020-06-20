const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.mdw')
const userModel = require('../model/users.model')

router.get('/', (req, res) => {
    res.render('dashboard/admin', {
        layout: false,
    })
})

module.exports = router

