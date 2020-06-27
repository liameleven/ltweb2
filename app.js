const express = require('express')
const app = express()
const auth = require('./middlewares/auth.mdw')
const userModel = require('./model/users.model')

app.use('/public', express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

require('./middlewares/view.mdw')(app)
require('./middlewares/session.mdw')(app)

app.use('/account', auth.login, require('./route/account.route'))
app.use('/dashboard', auth.notLogin, require('./route/dashboard.route'))

app.get('/dashboard', auth.notLogin, (req, res) => {
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

app.use((req, res) => {
    res.send('404')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`)
})