const route = require('express').Router()
const Tasks = require('../db').Tasks
const Policies = require('../db').Policies
const PolicyRisks = require('../db').PolicyRisk
const Risks = require('../db').Risks
const Users = require('../db').Users
const multer = require('multer')
const path = require('path')
var regex_array = []
var keyword_array = []
var FILE_LOCATION;
const handle = require('../utils');
var admin_email;
var admin_subject;
var final_result;


route.get('/', (req, res) => {
    if(req.user){
        res.render('tasks')
    } else {
        res.redirect('/login')
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + path.extname(file.originalname))
        FILE_LOCATION = "files/" + file.originalname.split('.')[0] + path.extname(file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'text/plain') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

route.post('/', upload.single('myFile'), (req, res, next) => {
    try {
        console.log("\nFile Uploaded Successfully\n");
        Policies.findAll({
            where: {
                username: req.user.dataValues.username
            },
            attributes: ['policy_id','admin_email','admin_subject']
        }).then((pol_ids) => {
            const policy_array = [];
            admin_email = pol_ids[0].dataValues.admin_email
            admin_subject = pol_ids[0].dataValues.admin_subject
            console.log(admin_email, admin_subject)
            for(let i = 0;i < pol_ids.length;i++) {
                policy_array.push(pol_ids[i].dataValues.policy_id)
            }
            policy_array.forEach( polId => {
                PolicyRisks.findAll({
                    where: {
                        policy_id: polId
                    },
                    attributes: ['risk_id']
                }).then((userRisks) => {
                    const pol_risk_array = []
                    for(let j = 0; j < userRisks.length; j++) {
                        pol_risk_array.push(userRisks[j].dataValues.risk_id)
                    }
                    pol_risk_array.forEach( p_riskId => {
                        Risks.findOne({
                            where: {
                                risk_id: p_riskId
                            },
                            attributes: ['keywords', 'regex', 'risk_match_count']
                        }).then((userRisksDetail) => {
                            const keywordString = userRisksDetail.dataValues.keywords
                            const regexString = userRisksDetail.dataValues.regex
                            const riskMatchCount = userRisksDetail.dataValues.risk_match_count
                            keyword_array = []
                            const splittedKeywords = keywordString.split(',')
                            splittedKeywords.forEach(word => {
                                word = word.trim()
                                if(word.length > 0){
                                    keyword_array.push(word.trim());
                                }
                            })
                            regex_array = []
                            const splittedRegex = regexString.split(",")
                            splittedRegex.forEach(reg => {
                                reg = reg.trim()
                                if(reg.length > 0) {
                                    regex_array.push(reg.trim())
                                }
                            })
                            if(regex_array.length === 0) {
                                console.log("Policy-ID : " + polId)
                                console.log("Risk-ID : " + p_riskId)
                                console.log("Only Profanity Risks Involved !")
                                handle.fileHandling(FILE_LOCATION, keyword_array, riskMatchCount, admin_email, admin_subject, policy_array)
                                // console.log(res_from_regex);
                            } else if (keyword_array.length === 0) {
                                console.log("Policy-ID : " + polId)
                                console.log("Risk-ID : " + p_riskId)
                                console.log("Only Regex Related Risks Involved !!")
                                handle.regexHandling(FILE_LOCATION, regex_array, riskMatchCount, admin_email, admin_subject, policy_array);
                                
                                // console.log(res_from_keyword);
                            } else {
                                console.log("Policy-ID : " + polId)
                                console.log("Risk-ID : " + p_riskId)
                                console.log("Both Profanity & Regex Related Risks Involved !!")
                                handle.fileHandling(FILE_LOCATION, keyword_array, riskMatchCount, admin_email, admin_subject, policy_array);
                                handle.regexHandling(FILE_LOCATION, regex_array, riskMatchCount, admin_email, admin_subject, policy_array);
                            }
                        })
                        
                    })
                })
            })
            res.redirect('/dashboard')
        })
        //console.log(final_result)
    } catch (error) {
        console.error(error)
    }
})

exports = module.exports = route