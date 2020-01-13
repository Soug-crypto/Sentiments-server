const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sentiments', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(" Succesfully connected to DB at 27017/sentiments")
});

const SentimentSchema = new mongoose.Schema({
  "id": {
    type: Number,
    default: 0,
    unique: true
  },
  "5": {
    type: Number,
    default: 0
  },
  "4": {
    type: Number,
    default: 0
  },
  "3": {
    type: Number,
    default: 0
  },
  "2": {
    type: Number,
    default: 0
  },
  "1": {
    type: Number,
    default: 0
  },
  "0": {
    type: Number,
    default: 0
  },
  "-1": {
    type: Number,
    default: 0
  },
  "-2": {
    type: Number,
    default: 0
  },
  "-3": {
    type: Number,
    default: 0
  },
  "-4": {
    type: Number,
    default: 0
  },
  "-5": {
    type: Number,
    default: 0
  }
});

const wordChoice = mongoose.model('wordChoice', SentimentSchema);

var find = (id) => {
  return wordChoice.findOne({id})
}



var update = (id, scoresArray) => {
  let obj = {};

  scoresArray.forEach((sentiment) => {
    obj[sentiment] = 1;
  })

  wordChoice.findOneAndUpdate({
      id
    }, {
      $inc: obj
    }, {
      upsert: true,
      new: true
    })
    .catch((err) => {
      console.log(err)
    })
}
//test with this
//update(0, [-0,-3,-4,-5])

var getStatus = (id) => {
  return wordChoice.aggregate([{
      "$match": {
        id
      }
    },
    {
      "$addFields": {
        "sentiment_average": {
          "$avg": ["$-5", "$-4", "$-3", "$-2", "$-1", "$0", "$1", "$2", "$3", "$4", "$5"]
        }
      }
    }
  ]).then((data) => {
    console.log(data)

    return data
  }).catch((err) => {
    console.log(err)
  })

}

module.exports.update = update;
module.exports.getStatus = getStatus;
module.exports.find = find;
