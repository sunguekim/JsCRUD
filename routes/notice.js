var express  = require('express');
var router = express.Router();
var Notice = require("../models/Notice");

router.get('/', async function(req,res){
    let totalNotice = await Notice.countDocuments({},function(err,c){
        return c;
      })
      let page = req.query.page;
      let limitCount = 5;
      let totalPage = parseInt(totalNotice / limitCount);
      if (totalNotice % limitCount > 0) {
        totalPage++;
      }
      let paging = {
        totalNotice : totalNotice,
        limitCount : limitCount,
        totalPage : totalPage,
        currentPage : page,
      }
    Notice.find({}).sort('-createdAt').skip((page-1)*5).limit(limitCount)            
        .exec(function(err, notice){    
        if(err) return res.json(err);
        res.render('notice/index', {notice : notice, paging:paging})
    });
});

router.get("/new", function (req, res) {
  res.render("notice/new");
});

router.post("/", function (req, res) {
  Notice.create({
    title : req.body.title,
    body : req.body.body,
    author : '운영자',
  }, function (err, notice) {
    if (err) return res.json(err);
    res.redirect("/notice");
  });
});

router.get("/:id", function (req, res) {
  Notice.findOne({ _id: req.params.id }, function (err, notice) {
    if (err) return res.json(err);
    res.render("notice/show", { notice: notice });
  });
});

router.get("/:id/edit", function (req, res) {
  Notice.findOne({ _id: req.params.id }, function (err, notice) {
    if (err) return res.json(err);
    res.render("notice/edit", { notice: notice });
  });
});

// update
router.put("/:id", function (req, res) {
  req.body.updatedAt = Date.now(); //2
  Notice.findOneAndUpdate({ _id: req.params.id }, req.body, function (err,notic) {
    if (err) return res.json(err);
    res.redirect("/notice/" + req.params.id);
  });
});

// destroy
router.delete("/:id", function (req, res) {
  Notice.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.redirect("/notice");
  });
});

module.exports = router;