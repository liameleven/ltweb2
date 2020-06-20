const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.use('/public', express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

require('./middlewares/view.mdw')(app)
require('./middlewares/session.mdw')(app)
require('./middlewares/locals.mdw')(app)



app.use('/account', require('./route/account.route'))
 app.use('/dashboard', require('./route/dashboard.route'))
app.use('/post', require('./route/post.route'))


const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`)
})