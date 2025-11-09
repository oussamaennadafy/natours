const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // 1 - create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PAWWSORD,
    },
    // activate in gmail "less secure app" option
  });
  // 2 - defind the email options
  const mailOptions = {
    from: "oussama ennadafy <oussama.ennadafy@gmail.com>",
  };
  // 3 - actually send the email
  transporter.sendMail(mailOptions, (err, info) => {
    console.log({ err, info });
  });
};

module.exports = { sendEmail };
