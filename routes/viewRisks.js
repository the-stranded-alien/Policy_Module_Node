const route = require('express').Router()
const Risks = require('../db').Risks

route.post('/', (req, res) => {
    console.log(req.body.c_id)
    Risks.update({ risk_title: req.body.c_title }, {
        where: {
            risk_id: req.body.c_id
        }
    }).then((change) => {
        res.redirect('/dashboard')
    })
})

route.get('/', (req, res) => {
    Risks.findAll({
        where: {
            username: req.user.dataValues.username
        }
    }).then((allUserRisks) => {
        res.render('viewRisks', { allUserRisks: allUserRisks })
    })
})




exports = module.exports = route 