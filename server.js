const express = require('express')
const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const bodyParser = require('body-parser');
//const ipfilter = require('express-ipfilter').IpFilter;
let passport = require("./passport");

const cors = require('cors');
const db = require('./db')


var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());

//add protection for the

// app.use(ipfilter(['127.0.0.1'], {
//   mode: 'allow'
// }));

var sentiment = new Sentiment();


app.post('/getstatus', passport.authenticate('jwt', {
  session: false
}), function(req, res) {
  var id = Number(req.user.id);
  db.getStatus(id).then((data) => {
    res.json(data)
  })

})

app.post('/', function(req, res) {
  var id = Number(req.body.id)
  var message = req.body.message;
  var result = sentiment.analyze(message);

  var individualWordSentimentArray = result['calculation'].map((val) => {
    for (var key in val) {
      return val[key]
    }
  });

  db.update(id, individualWordSentimentArray);

  res.status(201).end();
})

app.listen(8000);
