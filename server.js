const express = require('express')
const session = require('express-session')
const passport = require('./passport')

// Making an Express App
const app = express()

// Some Necessary Settings
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Setting The Session
app.use(session({
    secret: 'somesecretstring',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: (60 * 60 * 24 * 1000) }
}))

// Passport Settings (Starting Sessions)
app.use(passport.initialize())
app.use(passport.session())

// Setting Handlebars (hbs) as the View Engine
app.set("view engine", "hbs")

// Defining The Routes
app.use('/', require('./routes/root'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/risks', require('./routes/risks'))
app.use('/policies', require('./routes/policies'))
app.use('/policyrisk', require('./routes/policyrisk'))
app.use('/tasks', require('./routes/tasks'))
app.use('/viewRisks', require('./routes/viewRisks'))
// app.use('/viewPolicies', require('./routes/viewPolicies'))


// Starting The Server
app.listen(9876, () => console.log("Server Running On http://localhost:9876"))