const express = require('express')
const hbs = require('hbs')
const path = require('path')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
require('./db/mongoose')

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath =path.join(__dirname,'../templates/views')
const partialsPath =path.join(__dirname,'../templates/partials')

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/',(req,res) => {
    res.render('index')
}) 

module.exports = app
