const route = require('express').Router()
const Risks = require('../db').Risks
const Policies = require('../db').Policies
route.get('/', (req, res) => {
    if(req.user){
        res.render('dashboard')
    } else {
        res.redirect('/login')
    }
})

route.get('/risks', (req, res) => {
    res.render('risks')
})

route.get('/policies',(req,res) =>{
    res.render('policies');
})

route.get('/tasks',(req,res) => {
    res.render('tasks')
})

route.get('/viewRisks', (req, res) => {
    Risks.findAll({
        where: {
            username: req.user.dataValues.username
        }
    }).then((allUserRisks) => {
        res.render('viewRisks', { allUserRisks: allUserRisks })
    })
})

route.get('/viewPolicies', (req, res) => {
    Policies.findAll({
        where: {
            username: req.user.dataValues.username
        }
    }).then((allUserPolicies) => {
        res.render('viewPolicies', { allUserPolicies: allUserPolicies })
    })
})

exports = module.exports = route