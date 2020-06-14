const express = require('express')
const router = express.Router()
const moment = require('moment')
const bcrypt = require('bcryptjs')
const config = require('../config/config.json')
const usersModel = require('../model/users.model')

router.use('/public', express.static('public'))

router.get('/register', (req, res) => {
    res.render('account/register', {
        layout: false
    })
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    if (req.body.user_name.length === 0 || req.body.password.length === 0 || req.body.email.length === 0) {
        res.render('account/register', {
            layout: false,
            err: "You must fill all text box"
        })
    }
    const user = await usersModel.getByEmail(req.body.email)
    if (user != null) {
        res.render('account/register', {
            layout: false,
            err: "Email have already exist"
        })
    }
    if (req.body.permission == "2") {
        const user = await usersModel.getByPseudonym(req.body.pseudonym)
        if (user != null) {
            res.render('account/register', {
                layout: false,
                err: "Journalist's pseudonym have already exist"
            })
        }
    }
    console.log(user)
    const dob = moment(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    req.body.birthday = dob
    const hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds)
    req.body.password = hash
    if (req.body.permission == 1) {
        var now = moment().unix()
        req.body.premium_time = now + config.premium_time.dates * 24 * 60 * 60
    }
    console.log(req.body)
    await usersModel.create(req.body)
    res.render('index', {
        layout: false
    })
})


/////////////////////////////////////

router.get('/login', (req, res) => {
    res.render('account/login', {
        layout: false
    })

})  
router.post('/login', async function (req, res) {     
    const user= await usersModel.getByEmail(req.body.email);        
    if (user!=null)
    {  
        const rs = bcrypt.compareSync(req.body.password,user.password);
        
      if(rs==false)
      {
        res.render('account/login', {
            layout: false,
            err: 'Your Email Or Password Is Invalid'
        });
        }
      else 
      {
        if(rs==true){
        res.send('Dang Nhap Thanh Cong');
        }
      }
    }
    else
    {
        res.render('account/login', {
            layout: false,
            err: 'Your Email Is Not Exists'
          });
    }
})  
  

module.exports = router