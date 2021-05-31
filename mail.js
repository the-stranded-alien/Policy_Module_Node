const nodemailer = require('nodemailer');

function send(mail_body,admin_email,admin_subject) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sahilgpt1611@gmail.com',
            pass: 'up70by0074'
        }
    });
    
    var mailOptions = {
        from: 'sahilgpt1611@gmail.com',
        to: admin_email,
        subject: admin_subject,
        text: mail_body
    };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email Sent : ' + info.response);
    }
    });
}
exports = module.exports = { send };