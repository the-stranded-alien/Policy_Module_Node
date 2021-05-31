const route = require('express').Router()
const Risks = require('../db').Risks
const Policies = require('../db').Policies
const PolicyRisk = require('../db').PolicyRisk

var pol_id;

route.get('/', (req, res) => {
    if(req.user){
        Risks.findAll({
            where: {
                username: req.user.dataValues.username
            },
            attributes: ['risk_id', 'risk_title']
        }).then((userRisks) => {
            res.render('policyrisk', { risks: userRisks })
        })
    } else {
        res.redirect('/login')
    }
})


route.post('/', (req, res) => {
    Policies.findOne({
        limit: 1,
        order: [ [ 'createdAt', 'DESC' ] ],
        attributes: ['policy_id']
    }).then((result) => {
        for(var i = 0; i < req.body.userrisk.length; i++) {
            PolicyRisk.create({
                policy_id: result.dataValues.policy_id,
                risk_id: req.body.userrisk[i]
            })
        }
    }).then((done) => {
        res.redirect('/dashboard')
    })
})

exports = module.exports = route