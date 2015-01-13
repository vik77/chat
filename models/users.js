var crypto = require('crypto');
var async = require('async');
var mongoose = require('../config/mongoose');
Schema = mongoose.Schema;
var schema = new Schema ({
  username: {
    type: String,
	  unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  userimage: {
    type: String,
    unique: true
  }
});

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}
schema.virtual('password')
  .set(function(password) {
   this._plainPassword = password;
   this.salt = Math.random + '';
   this.hashedPassword = this.encryptPassword(password);
   this.userimage = '';
   })
  .get(function() {
    return this._plainPassword;
  })
  
schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
}

schema.statics.authoraise = function(username, password, callback) {
  var User = this;
  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
         callback(null, user);
        }
        else
        {
          console.log('Ошибка');
        }
      }
      else
      {
        var user = new User({username: username, password: password});
        user.save(function(err) {
          callback(null, user);
        });
      }
    }
  ], callback);
}

schema.statics.saveImage = function(username, /*password, */userimage, callback) {
  var User = this;
  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      /*if (user) {
        if (user.checkPassword(password)) {
         callback(null, user);
        }
        else
        {
          console.log('Ошибка');
        }
      }
      else*/
//      {
        console.log(username);
        var user = new User({username: 'user1', password: '1', userimage: 'qqq'});
        console.log('saveImage' + user.username + user.password);
        user.update({username: "user1"}, {
          userimage: "userimage_"
        }, function(err) {
          callback(null, user);
        })
        
//      }
    }
  ], callback);
}

exports.Users = mongoose.model('users', schema);
	
	
	
	
	
	
	
	
	
