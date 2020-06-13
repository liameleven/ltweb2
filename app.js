const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

app.use(express.urlencoded({
    extended: true
}))

app.engine('hbs', exphbs({
    layoutsDir: 'views/_layouts',
    defaultLayout: 'main',
    partialsDir: 'views/_partials',
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

app.use('/account',require('./route/account.route'))

const PORT = 3000
app.listen(PORT, () => {
    console.log(`server is running at localhost:${PORT}`)
})