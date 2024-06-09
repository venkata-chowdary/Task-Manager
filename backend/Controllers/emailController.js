const transporter = require('../util/transporter')


const sendRemainderEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: 'chowdaryimmanni@gmail.com',
        to,
        subject,
        text,
        html,
        debug: true,
        logger: true
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("mail sent")
        }
    })
}



module.exports = { sendRemainderEmail }