const express = require('express');
const cors = require('cors');

const sequelize = require('./src/util/dbConfig');
const { token, admin, optional } = require('./src/util/auth');
const modelAssociations = require('./src/util/modelAssociations');
const { pollCloseQueue } = require('./src/util/pollCloseQueue');

const newsletterRouter = require('./src/routes/newsletter.router');
const authRouter = require('./src/routes/auth.router');
const pollsRouter = require('./src/routes/polls.router');
const voteRouter = require('./src/routes/vote.router');
const userRouter = require('./src/routes/user.router');
const adminRouter = require('./src/routes/admin.router');
const indexRouter = require('./src/routes/index.router');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/newsletter', newsletterRouter);
app.use('/auth', authRouter);
app.use('/polls', optional, pollsRouter);
app.use('/vote', token, voteRouter);
app.use('/user', token, userRouter);
app.use('/admin', token, admin, adminRouter);
app.use('/', indexRouter);

// Error handling for routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log('Error', err);
  res.status(500).send({ error: "Your request could not be completed at this time." });
});

(async () => {
  try {
    await sequelize.authenticate();

    // sync models on start up just in case we add a new table
    await modelAssociations();
    // Looks for all open polls and creates timeouts for them to close
    await pollCloseQueue();

    app.listen(process.env.PORT || 3000, () => console.log(`App is running on ${process.env.PORT || 3000}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
