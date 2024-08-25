const nodemailer = require("nodemailer"); // use for send email

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "", // enter you're email here
    pass: "", // enter email app password
  },
});

function sendConfirmationEmail(to, code) {
  const mailOptions = {
    to: to, // recipient address
    subject: "Confirmation Signup email address", // subject line
    html: `<p>Thank you for registering. This is You're Confirmation Code is <b> ${code}</p>      
           <p>If you didn't request this, please ignore this email.</p>`, //html template for email confirmation
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendConfirmationEmail };
