const mail = require('./mail')
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

var res = "";
var email, subject;

// Keyword Matching Handling
function fileHandling(FILE_LOCATION, array_of_words, count, admin_email, admin_subject, policy_array){
async function loadMonoCounter() {
    const data = await fs.readFile(FILE_LOCATION, "binary");
    return Buffer.from(data);
}

loadMonoCounter().then((data) => {
    subject = admin_subject;
    email = admin_email;
    if(data === "")
    {
        console.log("\nNo Text Found !")
        return;
    }
    if(array_of_words[0] == "")
    {
        console.log("\nNo Keywords Found !")
        return;
    }
    result = data.toString();
    result =  result.replace(/(\r\n|\n|\r)/gm,"")
    array = result.split(" ")
    array_of_words.forEach(word => {
        localcount = 0
        array.forEach(element => {
            if(element === word && element !== "") 
            { 
                localcount++ 
            }
        });
        if(localcount >= count) {
            console.log("\nKeyword Matching Risk Detected !!" + "Due to Word : " + word);
            res += "\nKeyword Matching Risk Detected !!" + "Due to Word : " + word + "\n";
        } else {
            console.log("\nNo Keyword Matching Risks Detected !!");
        }
        mail.send(res, email, subject);
    })
}).catch(err => {
    console.log(err)
    })
}


//Regex Handling
function regexHandling(FILE_LOCATION,allowedRegexPatterns,count,admin_email,admin_subject, policy_array){
async function loadMonoCounter() {
    const data = await fs.readFile(FILE_LOCATION, "binary");
    return Buffer.from(data);
}

if(allowedRegexPatterns.length > 1)
{
var allowedRegexStr = '^(?:' + 
allowedRegexPatterns.join('|').replace(/\./g, '\\.').replace(/X/g, '\d+') + ')$';

var allowedRegexp = new RegExp(allowedRegexStr);
}
else
{
    allowedRegexp = allowedRegexPatterns
}
loadMonoCounter().then((data) => {
    subject = admin_subject;
    email = admin_email;
    if(data === "")
    {
        console.log("\nNo Text Found for Regex Testing !")
        return;
    }
    if(allowedRegexPatterns[0] == "")
    {
        console.log("\nNo Regex Pattern Found !!")
        return;
    }
    result = data.toString();
    result = result.replace(/(\r\n|\n|\r)/gm,"")
    array = result.split(" ")
    localcount = 0
    for(let i = 0; i < array.length; i++){
        if(array[i].match(allowedRegexp)) {
            localcount = localcount + 1;
            console.log("\nRegex Related Risks Detected ! Due to Text : " + array[i]);
            res += "\nRegex Related Risks Detected ! Due to Text : " + array[i] + "\n";
        }
    }
    if(localcount >= count) 
    {
        console.log("\nRegex Related Risks Found !!");
        res += "\nRegex Related Risks Found !!";
    }
    else 
    {
        console.log("\nNo Regex Related Risks Found !!");
    }
    mail.send(res, email, subject);
}).catch((err) => {
    console.log(err);
})
}

exports = module.exports = { fileHandling, regexHandling }