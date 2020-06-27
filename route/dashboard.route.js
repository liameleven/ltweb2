const express = require('express')
const router = express.Router()
const moment = require('moment')
const config = require('../config/config.json')
const userModel = require('../model/users.model')
const bigCategoryModel = require('../model/big-category.model')
const smallCategoryModel = require('../model/small-category.model')
const tagModel = require('../model/tag-name.model')
const managerModel = require('../model/manager.model')
const postModel = require('../model/post.model')
const OneDayInSeconds = 60 * 60 * 24
const auth = require('../middlewares/auth.mdw')

router.get('/', (req, res) => {
    if (req.session.authUser.permission == userModel.Subscriber) {
        res.redirect('/dashboard/subscriber')
    }
    if (req.session.authUser.permission == userModel.Admin) {
        res.redirect('/dashboard/admin')
    }
    if (req.session.authUser.permission == userModel.Writer) {
        res.redirect('/dashboard/writer')
    }
    if (req.session.authUser.permission == userModel.Editor) {
        res.redirect('/dashboard/editor')
    }
})

////////////ADMIN////////////
router.get('/admin', auth.isAdmin, (req, res) => {
    return res.render('layouts/admin-dashboard', {
        layout: 'admin-dashboard.hbs',
    })
})

////////////ADMIN-CATEGORY//////////////

router.get('/admin/big-category', auth.isAdmin, async (req, res) => {
    var categories = await bigCategoryModel.getAll()
    res.render('dashboard/category/big-category', {
        layout: 'admin-dashboard.hbs',
        categories: categories,
    })
})

router.get('/admin/big-category/edit', auth.isAdmin, async (req, res) => {
    if (req.query.bid === '') {
        res.redirect('/dashboard')
    }
    var category = await bigCategoryModel.getByID(req.query.bid)
    res.render('dashboard/admin/category/edit-big-category', {
        layout: 'admin-dashboard.hbs',
        category
    })
})

router.post('/admin/big-category/edit', auth.isAdmin, async (req, res) => {
    await bigCategoryModel.update(req.body)
    res.redirect('/dashboard/admin/big-category')
})

router.get('/admin/big-category/add', auth.isAdmin, (req, res) => {
    res.render('dashboard/category/add-big-category', {
        layout: 'admin-dashboard.hbs',
    })
})

router.post('/admin/big-category/add', auth.isAdmin, async (req, res) => {
    await bigCategoryModel.create(req.body)
    res.redirect('/dashboard/admin/big-category')
})

router.get('/admin/big-category/delete', auth.isAdmin, async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    await bigCategoryModel.delete(req.query.bid)
    res.redirect('back')
})

router.get('/admin/small-category', auth.isAdmin, async (req, res) => {
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

router.get('/admin/small-category/edit', auth.isAdmin, async (req, res) => {
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

router.post('/admin/small-category/edit', auth.isAdmin, async (req, res) => {
    await smallCategoryModel.update(req.body)
    res.redirect('/dashboard/small-category')
})

router.get('/admin/small-category/delete', auth.isAdmin, async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }
    await smallCategoryModel.delete(req.query.id)
    res.redirect('back')
})

router.get('/admin/small-category/add', auth.isAdmin, async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    res.render('dashboard/category/add-small-category', {
        layout: 'admin-dashboard.hbs',
        bigCategories
    })
})

router.post('/admin/small-category/add', async (req, res) => {
    await smallCategoryModel.create(req.body)
    res.redirect('/dashboard/small-category')
})

////////ADMIN-TAG-NAME/////////////////////
router.get('/admin/tag-name', auth.isAdmin, async (req, res) => {
    var tag = await tagModel.getAll()
    res.render('dashboard/tag/tag-name', {
        layout: 'admin-dashboard.hbs',
        tag: tag,
    })
})

router.get('/admin/tag-name/add', auth.isAdmin, (req, res) => {
    res.render('dashboard/tag/add-tag-name', {
        layout: 'admin-dashboard.hbs',
    })
})

router.post('/admin/tag-name/add', auth.isAdmin, async (req, res) => {
    await tagModel.create(req.body)
    res.redirect('/dashboard/tag-name')
})

router.get('/admin/tag-name/edit', auth.isAdmin, async (req, res) => {

    if (!req.query.id) {
        res.redirect('/dashboard')
    }
    var tag = await tagModel.getByID(req.query.id)
    res.render('dashboard/tag/edit-tag-name', {
        layout: 'admin-dashboard.hbs',
        tag
    })
})

router.post('/admin/tag-name/edit', auth.isAdmin, async (req, res) => {
    await tagModel.update(req.body)
    res.redirect('/dashboard/tag-name')
})

router.get('/admin/tag-name/delete', auth.isAdmin, async (req, res) => {
    if (!req.query.id) {
        return res.redirect('/dashboard')
    }

    await tagModel.delete(req.query.id)
    res.redirect('back')
})


///////////ADMIN-USERS//////////////

router.get('/admin/subscriber', auth.isAdmin, async (req, res) => {
    const page = +req.query.page || 1;
    if (page < 0) page = 1
    var offset = (page - 1) * config.pagination.limit
    var users = await userModel.pagebyPermission(userModel.Subscriber, config.pagination.limit, offset)
    var total = await userModel.countbyPermission(userModel.Subscriber)
    const nPages = Math.ceil(total / config.pagination.limit)
    const page_items = []

    if (page == 1) {
        for (let i = 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }
    else {
        for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }

    users.forEach(user => {
        var now = moment().unix()
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
        var premium_time = moment.unix(user.premium_time).format("DD-MM-YYYY  hh:mm")
        user.premium_time = premium_time
    })

    res.render('dashboard/user/subscriber', {
        layout: 'admin-dashboard.hbs',
        users,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    })
})

router.get('/admin/subscriber/extend-dashboard.hbs', async (req, res) => {
    if (!req.query.uid) {
        return res.redirect('/dashboard')
    }
    var premium_time = moment().unix() + config.premium_time.dates * OneDayInSeconds
    const entity = {
        premium_time: premium_time

    }
    await userModel.update(entity, req.query.uid)
    res.redirect('back')
})

router.get('/admin/writer', async (req, res) => {
    const page = +req.query.page || 1;
    if (page < 0) page = 1
    var offset = (page - 1) * config.pagination.limit
    var users = await userModel.pagebyPermission(userModel.Writer, config.pagination.limit, offset)
    var total = await userModel.countbyPermission(userModel.Subscriber)
    const nPages = Math.ceil(total / config.pagination.limit)
    const page_items = []

    if (page == 1) {
        for (let i = 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }
    else {
        for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }
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

router.get('/admin/editor', async (req, res) => {
    const page = +req.query.page || 1;
    if (page < 0) page = 1
    var offset = (page - 1) * config.pagination.limit
    var users = await userModel.pagebyPermission(userModel.Editor, config.pagination.limit, offset)
    var total = await userModel.countbyPermission(userModel.Subscriber)
    const nPages = Math.ceil(total / config.pagination.limit)
    const page_items = []

    if (page == 1) {
        for (let i = 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }
    else {
        for (let i = page - 1; i <= page + 1 && i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item)
        }
    }
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
    res.render('dashboard/user/editor/editor', {
        layout: 'admin-dashboard.hbs',

        users
    })
})
///////////////Manager-Editor/////////////////
router.get('/editor/manager-editor', async (req, res) => {
    var manager = await managerModel.getListByIDManager(req.query.uid)
    var uid = req.query.uid
    res.render('dashboard/user/editor/manager-editor', {
        layout: 'admin-dashboard.hbs',
        manager,
        uid
    })
})

router.get('/editor/manager-editor/add', async (req, res) => {
    var editors = await managerModel.getByID(req.query.uid)
    var bigCategories = await bigCategoryModel.getAll()
    console.log(editors)
    console.log(bigCategories)
    res.render('dashboard/user/editor/add-manager-editor', {
        layout: 'admin-dashboard.hbs',
        bigCategories
    })
})

router.post('/editor/manager-editor/add', async (req, res) => {
    await managerModel.create(req.body)
    res.redirect('/dashboard/user/editor/manager-editor')
})


////////////////POST///////////////////

router.get('/writer/post/write', (req, res) => {
    res.render('dashboard/post/post', {
        layout: 'admin-dashboard.hbs'
    })
})

router.post('/admin/post/write', async (req, res) => {
    console.log(req.body)
    if (req.body.title == "" || req.body.summary == "" || req.body.content == "")
        return res.render('back', {
            layout: 'admin-dashboard.hbs',
            err: "You must fill all text box"
        })
    const entity = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        bid: req.body.bid,
        sid: req.body.sid
    }
    await postModel.add(entity)
    res.render('OK')
})

module.exports = router

