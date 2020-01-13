const db = require('./db')
const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions['secretOrKey'] = 'soFarAway';
jwtOptions['passReqToCallback'] = true; // pass request object to the strategy

// Create Strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(req, jwt_payload, next) {
  db.find(jwt_payload.id)
    .then(found => {
      if (found) {
        next(null, found);
      } else {
        next(null, false);
      }
    }).catch(err => {
      next(null, false);
    });
});

passport.use(strategy);

module.exports = passport;
