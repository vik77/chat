/* GET users listing. */
exports.cabinet = function(req, res, next){
  res.render('cabinet');
};

//exports.send = function(req, res, next){
//  console.log(req.files.book.name);
//}
var path = require('path'),
    fs = require('fs');
    
exports.send = function(req, res, next){
    // загрузка фото
	fs.readFile(req.files.book.path, function (err, data) {
		var imageName = req.files.book.name;
    // Если какая-то ошибка, выводим информацию об ошибке и 
    // перенаправляем пользователя
		if(!imageName){
			console.log("There was an error");
			res.redirect("/");
			res.end();
		} else {
		  var newPath = __dirname + "/../public/uploads/" + imageName;
      console.log(newPath);
		  // записываем файл
		  fs.writeFile(newPath, data, function (err) {
      // запись в базу
      var Users = require('../models/users').Users;
	  // можно найти пользователя по req.session.user
      Users.saveImage(req.body.username, /*req.body.password, */newPath, function(err, user) {
        if (err) {
          console.log(err);
        }
        else
        {
          console.log(req.body.username);
        }
//        req.session.user = user._id;
//        res.redirect('/');
      });
      // открываем загруженный файл
		  res.redirect("/uploads/" + imageName);
      
		  });
		}
	});
};
