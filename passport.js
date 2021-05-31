const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy 
const Users = require('./db').Users

// Serializing The User Into The Application & Session
passport.serializeUser(function (user, done) {
    done(null, user.username)
})

// Deserializing The User From The Application & Session
passport.deserializeUser(function (username, done){
    Users.findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if(!user) {
            return done(new Error("No Such User !!"))
        }
        return done(null, user)
    }).catch((err) => {
        done(err)
    })
})

// Defining The Local Strategy
passport.use(new LocalStrategy ((username, password, done) => {
    Users.findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if(!user) {
            return done(null, false, {message: "No Such User !!"})
        }
        if(user.password !== password) {
            return done(null, false, { message: "Wrong Password !!" })
        }
        return done(null, user)
    }).catch((err) => {
        return done(err)
    })
}))

exports = module.exports = passport