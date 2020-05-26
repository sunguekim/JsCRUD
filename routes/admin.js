let express = require('express')
let router = express.Router();
let User = require('../models/User');

router.get('/', async function(req,res){
    if(req.session.is_admin){
      let totalUser = await User.countDocuments({},function(err,c){
          return c;
        })
        let page = req.query.page;
        let limitCount = 5;
        let totalPage = parseInt(totalUser / limitCount);
        if (totalUser % limitCount > 0) {
          totalPage++;
        }
        let paging = {
          totalUser : totalUser,
          limitCount : limitCount,
          totalPage : totalPage,
          currentPage : page,
        }
      User.find({}).skip((page-1)*5).limit(limitCount)            
          .exec(function(err, user){    
          if(err) return res.json(err);
          res.render('admin/adminPage', {user : user, paging:paging})
      });

    } else {
      res.redirect('/');
    }
});

router.delete('/:id', function(req, res){
    User.deleteOne({_id:req.params.id}, function(err ,user){
        if(err) return res.json(err);
        res.redirect('/admin');
    });
});

router.get('/:id/edit', function(req,res){
        User.findOne({_id:req.params.id}, function(err, user){
            if(err) return res.json(err);
            res.render('admin/userEdit', {user : user})
        });
});

router.put('/:id', function(req,res){
    function checkSpace(str) {
        if(str.search(/\s/) != -1) {
           return true; 
       } else {
           return false; 
       } 
     }
     if(checkSpace(req.body.userID)){
        res.render('failAction/userEditFail',{user : req.params});
     }else{
         User.findOneAndUpdate({_id:req.params.id}, req.body, function(err, user){
           if(err) return res.json(err);
           res.redirect('/admin');
         });
     }
  });

module.exports = router;