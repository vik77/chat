var Users = require('../models/users').Users;

exports.index = function(req, res){
  res.render('reg');
}

exports.send = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var users = new Users({
    username: username,
    password: password
  });
////  users.save(function(err, user){
//    console.log(arguments);
//    res.send({});
//	res.writeHead(302, {'location':'/'});
//    res.redirect('/');
  Users.authoraise(username, password, function(err, user) {
    if (err) {
      console.log(err);
    }
    else
    {
      console.log(user._id);
    }
    req.session.user = user._id;
    res.redirect('/');
  })

}

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/');
}	

