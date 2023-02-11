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

// eslint-disable-next-line max-len
const emailPollOpen = async (user, contents, title) => {
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

  const mailOptions = {
    from: '"Neutral Stack Admin" <admin@neutralstack.io>',
    to: user.email,
    subject: 'New Poll Open on NeutralStack.io',
    text: `A new poll just opened on NeutralStack.io with the title: ${title}`,
    html: contents,
  };

  const resp = await transporter.sendMail(mailOptions);
  if (resp.accepted[0]) {
    console.log(`Message sent to ${resp.accepted[0]} successfully`);
  } else {
    console.log(`Message was rejected from email: ${resp.rejected[0]}`);
  }
};

process.on('message', async (message) => {
  if (message.users && message.title) {
    // Get the poll email and place the TITLE with the code from the client
    const file = await readFile(path.join('emails_prod', 'poll.open.html'), { encoding: 'utf8' });

    await Promise.all(message.users.map(async (user) => {
      const contents = file.replace('{TITLE}', message.title).replace('{USER_EMAIL}', user.email);

      await emailPollOpen(user, contents, message.title);
    }));

    console.log('Complete, sending kill signal');
    return process.kill(process.pid, 'SIGINT');
  }
  console.log('We didnt get the info we needed, sending kill signal');
  return process.kill(process.pid, 'SIGINT');
});

module.exports = emailPollOpen;
