const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { readFileSync } = require('fs');

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
    if (err) {
      console.log('Access token error', err);
      return;
    }
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

    // Get the code email and place the LOGIN CODE with the code from the client
    const file = readFileSync('build_production/code.html', 'utf8');
    const codeInserted = file.replace('LOGIN CODE', code);

    const mailOptions = {
      from: '"Neutral Stack Admin" <admin@neutralstack.io>',
      to: email,
      subject: 'Single Use Login Code for NeutralStack.io ',
      text: `Your one time login code is: ${code}`,
      html: codeInserted,
    };

    transporter.sendMail(mailOptions, (sendErr, data) => {
      if (sendErr) {
        console.log(`Send error ${err}`);
      } else {
        console.log('Email sent successfully', data);
      }
    });
  });
};

module.exports = emailLoginCode;
