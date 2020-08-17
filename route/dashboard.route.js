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
const auth = require('../middlewares/auth.mdw')
const multer = require('multer')
const postTagModel = require('../model/post-tag.model')
const usersModel = require('../model/users.model')
const { getAllByID } = require('../model/post-tag.model')
const OneDayInSeconds = 60 * 60 * 24

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

////////WRITER///////////////
router.get('/writer', (req, res) => {
    res.render('layouts/writer-dashboard', {
        layout: false,
        userName: req.session.authUser.user_name
    })
})
////////EDITOR///////////////
router.get('/editor', (req, res) => {
    res.render('layouts/editor-dashboard', {
        layout: false,
        userName: req.session.authUser.user_name
    })
})
////////////ADMIN////////////
router.get('/admin', (req, res) => {
    res.render('layouts/admin-dashboard', {
        layout: false,
        userName: req.session.authUser.user_name
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
    res.render('dashboard/category/edit-big-category', {
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

router.get('/small-category', async (req, res) => {
    smallCategories = await smallCategoryModel.getListByBID(req.query.bid)
    res.json(smallCategories)
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
    var offset = (page - 1) * config.pagination.limitconfig/config.json
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

router.get('/admin/subscriber/extend', async (req, res) => {
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

///////////////ADMIN-Manager-Editor/////////////////

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

router.get('/admin/editor/manager-editor', auth.isAdmin, async (req, res) => {
    var manager = await managerModel.getListByIDManager(req.query.uid)
    var uid = req.query.uid
    res.render('dashboard/user/editor/manager-editor', {
        layout: 'admin-dashboard.hbs',
        manager,
        uid
    })
})

router.get('/admin/editor/manager-editor/add', auth.isAdmin, async (req, res) => {
    var editors = await managerModel.getByID(req.query.uid)
    var bigCategories = await bigCategoryModel.getAll()
    bigCategories.forEach(e =>
        e.choose = true)
    for (let i = 0; i < bigCategories.length; i++) {
        for (let j = 0; j < editors.length; j++) {
            if (bigCategories[i].bid === editors[j].bid) {
                bigCategories[i].choose = false
                break
            }
            bigCategories[i].choose = true
        }
    }
    res.render('dashboard/user/editor/add-manager-editor', {
        layout: 'admin-dashboard.hbs',
        bigCategories,
        uid: req.query.uid
    })
})

router.post('/admin/editor/manager-editor/add', auth.isAdmin, async (req, res) => {
    await managerModel.create(req.body)
    res.redirect(`/dashboard/admin/editor/manager-editor?uid=${req.body.uid}`)
})

router.get('/admin/editor/manager-editor/delete', auth.isAdmin, async (req, res) => {
    await managerModel.delete(req.query)
    res.redirect('back')
})


////////////////WRITER-POST///////////////////

router.get('/writer/post/list', auth.isWriter, async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    var posts = await postModel.getByWriter(req.session.authUser.uid)
    if (posts != null) {
        posts.forEach(post => {
            if (post.status == 1) {
                post.isActive = false
            }
            else {
                post.isActive = true
            }
            post.status = postModel.parseStatusHTML(post.status)
            bigCategories.forEach(big => {
                if (post.bid === big.bid) {
                    post.bigCategoryName = big.name
                }
            })
            smallCategories.forEach(small => {
                if (post.sid === small.id) {
                    post.smallCategoryName = small.name
                }
            })
        })
    }
    res.render('dashboard/post/list-post', {
        layout: 'writer-dashboard.hbs',
        posts
    })
})

router.get('/writer/post/group-list', auth.isWriter, async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    var posts = await postModel.getByGroupStatus(req.session.authUser.uid,req.query.status)
    if (posts != null) {
        posts.forEach(post => {
            if (post.status == 1) {
                post.isActive = false
            }
            else {
                post.isActive = true
            }
            post.status = postModel.parseStatusHTML(post.status)
            bigCategories.forEach(big => {
                if (post.bid === big.bid) {
                    post.bigCategoryName = big.name
                }
            })
            smallCategories.forEach(small => {
                if (post.sid === small.id) {
                    post.smallCategoryName = small.name
                }
            })
        })
    }
    res.render('dashboard/post/group-list-post', {
        layout: 'writer-dashboard.hbs',
        posts
    })
})

router.get('/writer/post/write', auth.isWriter, async (req, res) => {
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
        big.bigName = big.name
    });
    res.render('dashboard/post/write-post', {
        layout: 'writer-dashboard.hbs',
        bigCategories

    })
})

const storage = multer.diskStorage({
    filename(req, file, cb) {
        cb(null, String(file.originalname));
    },
    destination(req, file, cb) {
        cb(null, './public/images');
    }
})
const upload = multer({ storage });
router.post('/writer/post/write', auth.isWriter, upload.single('input-b1'), async (req, res) => {
    if (req.body.title == "" || req.body.summary == "" ||
        req.body.content == "") {
        return res.render('back', {
            layout: 'writer-dashboard.hbs',
            err: "You must fill all text box"
        })
    }
    var cateID = String(req.body.cateID).split("-")
    console.log(req.body)
    const entity = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        user_id: req.session.authUser.uid,
        premium: req.body.premium,
        bid: cateID[0],
        sid: cateID[1],
        image_path: '/public/images/' + req.file.originalname
    }
    await postModel.add(entity)
    res.redirect('/dashboard/writer/post/list')
})
////////Editor Manager Post///////
router.get('/editor/post/list', auth.isEditor, async (req, res) => {
    var bigCategories = await bigCategoryModel.getAll()
    var smallCategories = await smallCategoryModel.getAll()
    var posts = await postModel.getPostByBigCate(req.session.authUser.uid)
    if (posts != null) {
        posts.forEach(post => {
            post.status = postModel.parseStatusHTML(post.status)
            bigCategories.forEach(big => {
                if (post.bid === big.bid) {
                    post.bigCategoryName = big.name
                }
            })
            smallCategories.forEach(small => {
                if (post.sid === small.id) {
                    post.smallCategoryName = small.name
                }
            })
        })
    }
    res.render('dashboard/browse/list-post', {
        layout: 'editor-dashboard.hbs',
        posts
    })
})

router.get('/editor/post', auth.isEditor, async (req, res) => {
    post = await postModel.getByIDBrowse(req.query.id)
    var status = false
    if (post.status == 0) {
        status = true
    }
    res.render('dashboard/browse/read-post', {
        layout: "editor-dashboard.hbs",
        post,
        id: req.query.id,
        status
    })
})

router.get('/editor/post/deny-post', auth.isEditor, async (req, res) => {
    post = await postModel.getByIDBrowse(req.query.id)
    res.render('dashboard/browse/deny-post', {
        layout: "editor-dashboard.hbs",
        post
    })
})

router.post('/editor/post/deny-post', auth.isEditor, async (req, res) => {
    req.body.status = 2
    req.body.id = req.query.id
    await postModel.updateDenyPost(req.body)
    res.redirect('/dashboard/editor/post/list')
})

router.get('/editor/post/success-post', auth.isEditor, async (req, res) => {
    post = await postModel.getByIDBrowse(req.query.id)
    var bigCategories = await managerModel.getListByIDManager(req.session.authUser.uid)
    var smallCategories = await smallCategoryModel.getAll()
    bigCategories.forEach(big => {
        var arraySmallCate = new Array()
        smallCategories.forEach(small => {
            if (big.bid === small.bid) {
                arraySmallCate.push(small)
            }
        })
        big.smallCategories = arraySmallCate
        big.bigName = big.name
    })
    bigCategories.forEach(big => {
        if (big.bid === post.bid) {
            big.smallCategories.forEach(small => {
                if (small.id === post.sid) {
                    small.selected = true
                }
                else {
                    small.selected = false
                }
            })
        }
    })
    res.render('dashboard/browse/success-post', {
        layout: "editor-dashboard.hbs",
        post,
        bigCategories
    })
})

router.post('/editor/post/success-post', auth.isEditor, async (req, res) => {
    var cateID = String(req.body.cateID).split("-")
    const date = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var condition = {
        status: 1,
        id: req.query.id,
        bid: cateID[0],
        sid: cateID[1],
        date: date
    }
    await postModel.updateSuccessPost(condition)
    res.redirect('/dashboard/editor/post/list')
})
////////Editor-Post-Tag////////////////////
router.get('/editor/post/tag-name', auth.isEditor, async (req, res) => {
    var postTag = await postTagModel.getAllByID(req.query.id)
    var tagName = await tagModel.getAll()
    if (postTag != null) {
        postTag.forEach(tagP => {
            tagName.forEach(tag => {
                if (tagP.tag_id === tag.id) {
                    tagP.name = tag.name
                }
            })

        })
    }
    res.render('dashboard/post-tag/tag-post', {
        layout: 'editor-dashboard.hbs',
        postTag,
        postid: req.query.id
    })
})

router.get('/editor/post/tag-name/add', auth.isEditor, async (req, res) => {
    var tag = await tagModel.getAll()
    res.render('dashboard/post-tag/add-tag-post', {
        layout: 'editor-dashboard.hbs',
        tag
    })
})

router.post('/editor/post/tag-name/add', auth.isEditor, async (req, res) => {
    const entity = {
        post_id: req.query.post_id,
        tag_id: req.body.tagid
    }
    await postTagModel.create(entity)
    res.redirect('/dashboard/editor/post/list')
})

router.get('/editor/post/tag-name/delete', auth.isEditor, async (req, res) => {
    if (!req.query.post_id || !req.query.tag_id) {
        return res.redirect('/dashboard')
    }
    await postTagModel.deletePostTag(req.query.post_id, req.query.tag_id)
    res.redirect('back')
})

///////Update Profile/////////////////
router.post('/updateprofile', async (req, res) => {
    console.log(req.session.authUser.uid)
    console.log(req.body)
    const dob = moment(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD')
    req.body.birthday = dob
    await userModel.update(req.body, req.session.authUser.uid)
    if (req.session.authUser.permission == usersModel.Subscriber)
        return res.redirect('/')
    else
        return res.redirect('/dashboard')
})
router.get('/updateprofile', async (req, res) => {
    var user = await userModel.getByUserId(req.session.authUser.uid)
    if (req.session.authUser.gender == 1) {
        var male = true
    }
    else {
        var male = false
    }
    user.birthday = moment(user.birthday).format("DD/MM/YYYY")
    res.render('dashboard/updateprofile', {
        uid: req.session.authUser.uid,
        layout: false,
        isWriter: req.session.authUser.permission == usersModel.Writer,

        user,
        male
    })
})
////////////////////////Writer-Edit-Tag//////////////
router.get('/writer/post', auth.isWriter, async (req, res) => {
    var postTag = await postTagModel.getAllByID(req.query.id)
    var tagName = await tagModel.getAll()
    if (postTag != null) {
        postTag.forEach(tagP => {
            tagName.forEach(tag => {
                if (tagP.tag_id === tag.id) {
                    tagP.name = tag.name
                }
            })

        })
    }
    res.render('dashboard/post-tag/writer-tag-post', {
        layout: 'writer-dashboard.hbs',
        postTag,
        postid: req.query.id
    })
})

router.get('/writer/post/add', auth.isWriter, async (req, res) => {
    var tag = await tagModel.getAll()
    res.render('dashboard/post-tag/add-tag-post', {
        layout: 'writer-dashboard.hbs',
        tag
    })
})

router.post('/writer/post/add', auth.isWriter, async (req, res) => {
    const entity = {
        post_id: req.query.post_id,
        tag_id: req.body.tagid
    }
    await postTagModel.create(entity)
    res.redirect('/dashboard/writer/post/list')
})

router.get('/writer/post/delete', auth.isWriter, async (req, res) => {
    if (!req.query.post_id || !req.query.tag_id) {
        return res.redirect('/dashboard')
    }
    await postTagModel.deletePostTag(req.query.post_id, req.query.tag_id)
    res.redirect('back')
})
////////Writer-Edit-Post//////////////
router.get('/writer/post/edit-post', auth.isWriter, async (req, res) => {
    const posts = await postModel.getAllByID(req.query.id);
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
        big.bigName = big.name
    });
    bigCategories.forEach(big => {
        if (big.bid === posts.bid) {
            big.smallCategories.forEach(small => {
                if (small.id === posts.sid) {
                    small.selected = true
                }
                else {
                    small.selected = false
                }
            })
        }
    })
    if (posts.premium == 1) {
        posts.checked = true
    }
    else {
        posts.checked = false
    }
    var isReject = false
    if (posts.status == 2) {
        isReject = true
    }
    res.render('dashboard/post/edit-post', {
        layout: 'writer-dashboard.hbs',
        content: posts.content,
        title: posts.title,
        summary: posts.summary,
        checked: posts.checked,
        isReject,
        reason: posts.reason,
        status: posts.status,
        bigCategories
    })
})
router.post('/writer/post/edit-post', auth.isWriter, async (req, res) => {
    if (req.body.title.length === 0 || req.body.summary.length === 0 ||
        req.body.content.length === 0) {
        return res.render('back', {
            layout: 'writer-dashboard.hbs',
            err: "You must fill all text box"
        })
    }

    if (req.body.premium == null) {
        premium = 0
    }
    else {
        premium = 1
    }
    

    var cateID = String(req.body.cateID).split("-")
    const entity = {
        id: req.query.id,
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        user_id: req.session.authUser.uid,
        premium,
        status: 0,
        bid: cateID[0],
        sid: cateID[1]
    }
    console.log(entity)
    await postModel.updatePost(entity)
    res.redirect('/dashboard/writer/post/list')
})
module.exports = router

