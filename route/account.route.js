const express = require('express')
const router = express.Router()
const moment = require('moment')
const bcrypt = require('bcryptjs')
const config = require('../config/config.json')
const usersModel = require('../model/users.model')
const randomInt = require('random-int');
var nodemailer = require('nodemailer');
const auth = require('../middlewares/auth.mdw')

const OneDayInSeconds = 60 * 60 * 24

/////////////REGISTER//////////////////

router.get('/register', auth.login, (req, res) => {
    res.render('account/register', {
        layout: false
    })
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    if (req.body.user_name.length === 0 || req.body.password.length === 0 || req.body.email.length === 0) {
        return res.render('account/register', {
            layout: false,
            err: "You must fill all text box"
        })
    }
    const user = await usersModel.getByEmail(req.body.email)
    if (user != null) {
        return res.render('account/register', {
            layout: false,
            err: "Email have already exist"
        })
    }
    if (req.body.permission === usersModel.Writer) {
        const user = await usersModel.getByPseudonym(req.body.pseudonym)
        if (user != null) {
            return res.render('account/register', {
                layout: false,
                err: "Writer's pseudonym have already exist"
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
        req.body.premium_time = now + config.premium_time.dates * OneDayInSeconds
    }
    console.log(req.body)
    await usersModel.create(req.body)
    res.redirect('/account/login')
})


/////////////LOGIN///////////////////

router.get('/login', auth.login, (req, res) => {
    res.render('account/login', {
        layout: false
    })
})

router.post('/login', async function (req, res) {
    const user = await usersModel.getByEmail(req.body.email);
    if (user != null) {
        const rs = bcrypt.compareSync(req.body.password, user.password);

        if (!rs) {
            return res.render('account/login', {
                layout: false,
                err: 'Your Email Or Password Is Invalid'
            });
        }

        delete user.password_hash;
        req.session.isAuthenticated = true;
        req.session.authUser = user;

        if (user.permission == usersModel.Subscriber) {
            return res.redirect('/')
        }
        return res.redirect('/dashboard')
    }
    res.render('account/login', {
        layout: false,
        err: 'Your Email Or Password Is Invalid'
    });
})

///////////RESET-PASSWORD/////////////////////

async function sendmail(to_email, name, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'tttintran303@gmail.com', // generated ethereal user
            pass: 'Htin334936336', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'tttintran303@gmail.com', // sender address // random ma sao m
        to: to_email, // list of receivers
        subject: "Ma xac nhan", // Subject line
        text: `Dear ${name} You have selected from LTWEB2@gmail.com as your new verification page: ${otp} this code will expire three hours after email was send Why you received this email apple requires verification whenever an email address If you did not make this request, you can ignore this email`,
        html: `Dear ${name} <br> You have selected from LTWEB2@gmail.com as your new verification page: <br><h2> ${otp} </h2>  This code will expire three hours after email was send <br> Why you received this email apple requires verification whenever an email address <br> If you did not make this request, you can ignore this email`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

router.post("/forgotpassword", async (req, res) => {
    const user = await usersModel.getByEmail(req.body.email)
    if (user == null) {
        return res.render('account/forgotpassword', {
            layout: false,
            err: "Email khong ton tai"
        })
    }
    if (req.body.email === '') {
        return res.render('account/forgotpassword', {
            layout: false,
            err: "Vui long dien email"
        })
    }
    const otp = randomInt(100000, 999999)
    const temp = {
        otp: otp
    }
    await usersModel.updateotp(temp, user.uid);
    sendmail(req.body.email, user.user_name, otp).catch(console.error);
    res.redirect('/account/checkotp');
})

router.post('/checkotp', async (req, res) => {
    const code = await usersModel.getbyCode(req.body.otp)
    if (code == null) {

        return res.render('account/checkotp', {
            layout: false,
            err: "Ma kich hoat khong dung"
        })
    }
    if (req.body.otp === '') {
        return res.render('account/checkotp', {
            layout: false,
            err: "Vui long dien ma xac nhan"
        })
    }
    res.redirect(`resetpass?otp=${req.body.otp}`);
})

router.post('/resetpass', async (req, res) => {
    const user = await usersModel.getbyCode(req.body.otp)
    if (user == null) {
        return res.render('account/resetpass', {
            layout: false,
            err: "Khong tim thay tai khoan"
        })
    }

    if (req.body.password === '') {
        return res.render('account/resetpass', {
            layout: false,
            err: "Vui long dien mat khau"
        })
    }
    const temp = {
        password: bcrypt.hashSync(req.body.password, config.authentication.saltRounds)
    }
    await usersModel.update(temp, user.uid);
    res.redirect('/account/login');
})

router.get('/forgotpassword', (req, res) => {
    res.render('account/forgotpassword', {
        layout: false
    })
})

router.get('/checkotp', (req, res) => {
    res.render('account/checkotp', {
        layout: false
    })
})

router.get('/resetpass', (req, res) => {
    res.render(`account/resetpass`, {
        otp: req.query.otp,
        layout: false
    })
})

module.exports = router