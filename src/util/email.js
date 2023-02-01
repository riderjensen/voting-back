const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN,
});

const emailLoginCode = (email, code) => {
  oauth2Client.getAccessToken((err, accessToken) => {
    console.log('ERROR', err);
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'admin@neutralstack.io',
        pass: process.env.EMAIL_PASSWORD,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: 'admin@neutralstack.io',
      to: email,
      subject: 'One Time NeutralStack.io Login Code',
      text: `Your one time code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (sendErr, data) => {
      if (sendErr) {
        console.log(`Send error ${err}`);
      } else {
        console.log(`Email sent successfully: ${data}`);
      }
    });
  });
};

module.exports = emailLoginCode;
