const path = require('node:path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { readFile } = require('node:fs/promises');

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN,
});

const emailLoginCode = async (email, code) => {
  const { token } = await oauth2Client.getAccessToken();
  if (!token) {
    console.log('Access token error for email, returning early');
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
      token,
    },
  });

  // Get the code email and place the LOGIN CODE with the code from the client
  const file = await readFile(path.join('emails_prod', 'code.html'), { encoding: 'utf8' });
  const codeInserted = file.replace('{LOGIN CODE}', code);

  const mailOptions = {
    from: '"Neutral Stack Admin" <admin@neutralstack.io>',
    to: email,
    subject: 'Single Use Login Code for NeutralStack.io ',
    text: `Your one time login code is: ${code}`,
    html: codeInserted,
  };

  const resp = await transporter.sendMail(mailOptions);
  if (resp.accepted[0]) {
    console.log(`Message sent to ${resp.accepted[0]} successfully`);
  } else {
    console.log(`Message was rejected from email: ${resp.rejected[0]}`);
  }
};

module.exports = emailLoginCode;
