const route = require('express').Router()
const Policies = require('../db').Policies
const Risks = require('../db').Risks
const PolicyRisks = require('../db').PolicyRisk

route.get('/', (req, res) => {
    if(req.user){
        res.render('policies')
    } else {
        res.redirect('/login')
    }
})

route.post('/', (req, res) => {
    Policies.create({
        policy_name: req.body.title,
        remedy_type: req.body.remtype,
        remedy_time: req.body.remtime,
        on_remedy_user: req.body.notify_user ? true : false,
        on_remedy_admin: req.body.notify_admin ? true : false,
        admin_email: req.body.email_admin,
        admin_subject: req.body.subject_admin,
        username: req.user.dataValues.username
    }).then((createdPolicy) => {
        res.redirect('/policyrisk')
    })
})

exports = module.exports = route