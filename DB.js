var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var object = new Schema(
  {
    id: String,
    created_time: String,
    type: String,
    from: {
      name: String,
      id: String
    },
    shares: Number,
    likes: Number,
    reactions: {
      like: Number,
      love: Number,
      haha: Number,
      wow: Number,
      angry: Number,
      sad: Number
    },
    comments: {
      context: [
        {
          created_time: String,
          from: {
            name: String,
            id: String
          },
          message: String,
          id: String
        }
      ],
      summary: Number
    }
  }
);

mongoose.model('FBDB', Todo);
mongoose.connect('mongodb://localhost/FBDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});
//db.close();
