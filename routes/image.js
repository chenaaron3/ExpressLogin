var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require("path")
var DataURI = require('datauri').promise;

var storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public\\uploads");
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }});
var upload = multer({storage:storage});

// route address is in addition to routed folder
// /imageUpload/xd
router.get('/request', function(req, res, next) {
    console.log(("Image Upload"));
    res.render('image');
    res.end();
});

router.post('/echo', upload.single("image"), function(req, res, next){
   console.log("Received Image");
   console.log(req.file);
   console.log(req.body);
   console.log("Dirname: " + __dirname);
   const absolutePath = path.join(__dirname,"..", req.file.path);
   console.log("Abs:" + absolutePath);
    // send image by getting data uri
    // DataURI(req.file.path)
    //     .then(content => {
    //         res.render('image', {file: content});
    //         res.end();
    //     })
    //     .catch(err => { throw err; });

    // send image by relative path
    res.render('image', {file: path.join("..", "uploads", req.file.filename)});
    res.end();
});

function readTextFile(path)
{

}

module.exports = router;
