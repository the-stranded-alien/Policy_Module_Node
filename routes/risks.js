const route = require('express').Router()
const Risks = require('../db').Risks

route.get('/', (req, res) => {
    if(req.user){
        res.render('risks')
    } else {
        res.redirect('/login')
    }
})

route.post('/', (req, res) => {
    Risks.create({
        risk_title: req.body.title,
        status: req.body.status ? true : false,
        keywords: req.body.keywords,
        description: req.body.description,
        regex: req.body.regex,
        risk_match_count: req.body.count,
        username: req.user.dataValues.username
    }).then((createdRisk) => {
        res.redirect('/dashboard')
    })
})

exports = module.exports = route