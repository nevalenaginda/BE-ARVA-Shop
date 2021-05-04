const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PASSWORD, // generated ethereal password
  },
});

const sendMail = (mailTo, body) => {
  return new Promise((resolve, reject) => {
    // send mail with defined transport object
    try {
      transporter
        .sendMail({
          from: process.env.EMAIL, // sender address
          to: mailTo, // list of receivers
          subject: "ARVA Shop Mail Notifications", // Subject line
          text: "ARVA Shop Apps", // plain text body
          html: `<body style="margin: 0; padding: 0;">
        <table cellpadding="0" cellspacing="0" width="100%">
         <tr>
          <td>
           <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
         <td>
          <table align="center" cellpadding="0" cellspacing="0" width="600">
        <tr>
         <td bgcolor="#DB3022" style="padding: 20px 0 30px 0;" align="center">
         ARVA SHOP
         </td>
        </tr>
        <tr>
         <td bgcolor="#D4D4D4" style="padding: 40px 30px 40px 30px;">
        <table cellpadding="0" cellspacing="0" width="100%">
         <tr>
          <td>
           Hello ${body.name}!
          </td>
         </tr>
         <tr>
          <td style="padding: 20px 0 30px 0;">
           ${body.text}
          </td>
         </tr>
         <tr>
          <td>
           <a href="${body.url}">${body.textBtn}</a>
          </td>
         </tr>
        </table>
       </td>
        </tr>
        <tr>
         <td bgcolor="#F01F0E" align="center">
          URL Verify Will Expired 1 Hours After Recived!
         </td>
        </tr>
       </table>
         </td>
        </tr>
       </table>
          </td>
         </tr>
        </table>
       </body>`, // html body
        })
        .then(() => {
          resolve("Success! Please Check Your Email!");
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject("Failed!");
    }
  });
};

module.exports = sendMail;
