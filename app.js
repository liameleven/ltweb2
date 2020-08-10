const express = require('express')
const app = express()
const auth = require('./middlewares/auth.mdw')

app.use('/public', express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

require('./middlewares/view.mdw')(app)
require('./middlewares/session.mdw')(app)

///////////LOGOUT////////////

app.get('/logout', (req, res) => {
    req.session.isAuthenticated = false
    req.session.authUser = null
    res.redirect('/account/login')
})

app.use('/account', auth.login, require('./route/account.route'))
app.use('/dashboard', auth.notLogin, require('./route/dashboard.route'))
app.use('/', require('./route/news.route'))

app.use((req, res) => {
    res.send('404')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`)
})