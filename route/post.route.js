const express = require('express')
const router = express.Router()
const moment = require('moment')
const config = require('../config/config.json')
const postmodel = require('../model/post.model')
const auth = require('../middlewares/auth.mdw')
const { encodeBase64 } = require('bcryptjs')


////ADD POST//
router.get('/write-post', auth, (req, res) => {
    res.render('post/write-post', {
        layout: false
    })
})
router.post('/write-post', async function (req, res) {
    if (req.body.title == '' || req.body.content == '' || req.body.sumcontent == '' || req.body.bid == '' || req.body.sid == '') {
        return res.render('post/write-post', {
            layout: false,
            err: "Ban can dien day du thong tin"
        })
    }
    const authUser = req.session.authUser;//lay user dang dang nhap

    let IsPre;
    if (req.body.IsPremium === "1") {
        IsPre = 1;
    }
    else {
        IsPre = 0;
    }
    const userid = new Number(authUser.uid);
    const entity = {
        title: req.body.title,
        content: req.body.content,
        sum_content: req.body.sumcontent,
        date: moment().format('YYYY-MM-DD'),
        status: 0,
        reason: " ",
        user_id: userid,
        permium: IsPre,
        bid: req.body.bid,
        sid: req.body.sid,
        view: 0

    }
    await postmodel.add(entity);
    return res.send('Ok');

})
module.exports = router