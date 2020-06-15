const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.use(express.urlencoded({
    extended: true
}))

require('./middlewares/view.mdw')(app)
require('./middlewares/session.mdw')(app)

app.use('/account',require('./route/account.route'))

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`)
})