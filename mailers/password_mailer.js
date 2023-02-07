const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newPassword =  (user) => {
   return new Promise((resolve, reject)=>{
    let htmlString = nodeMailer.renderTemplate({user: user}, '/password/password_reset_mail.ejs');

    nodeMailer.transporter.sendMail({
       from: 'cnauthtests@gmaill',
       to: user.email,
       subject: "New Password!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            reject(err);
            return;
        }
        // console.log('Message sent', info);
        resolve(info);
        return;
    });
   })
}