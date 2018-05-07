const express = require('express');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const redis = require('connect-redis')(session);
const path = require('path');
const authenticatePassport = require('./library/passport');
const db = require('./models');
const routes = require('./routes');

//const PORT = require(`../config/${process.env.NODE_ENV}`).PORT;
const PORT = process.env.PORT || 4567;
const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ "extended" : false }));
app.use(bodyParser.json());
app.use(session({
  store: new redis(),
  secret: 'Ricky',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/api', routes);

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log(`Server listening on port ${PORT}`);
});