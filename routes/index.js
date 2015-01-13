/* GET home page. */
exports.index = function(req, res){
  if (req.params.id) {
   var index = req.params.id;
  } else {
   var index = 'index';
  }
   var Maintext = require('../models/maintexts').maintext;
   Maintext.findOne({'url': index},
     function(err, text) {
	   if (!text) {
	     text = {
	       name: 'Добро пожаловать на сайт',
         body: 'страница не найдена'
	     }
	   }
       res.render('index', {text: text });
     }
   );
}
