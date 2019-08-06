var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require("path")
var database = require("../public/javascripts/database");

// only works with localhost
var diskStorage = multer.diskStorage({
    destination:function(req, file, cb){
        console.log("File: " + file);
        cb(null, "public\\uploads");
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }});

var memoryStorage = multer.memoryStorage();

var upload = multer({storage:memoryStorage});

// route address is in addition to routed folder
// /imageUpload/xd
router.get('/request', function(req, res, next) {
    console.log(("Image Upload"));
    res.render('image', {requestFile:true, blobs:[]});
    res.end();
});

// only works with localhost
router.post('/echo', upload.single("image"), function(req, res, next){
   console.log("Received Image");
   console.log(req.file);

    // only works for memory storage
    const DataURI = require("datauri");
    const datauri = new DataURI();
    datauri.format('.png', req.file.buffer);
    database.addToImageTable(datauri.content);
    database.getAllImages(function(blobs) {
        res.render('image', {requestFile:false, blobs:blobs});
        res.end();
    })

    // only works for disk storage
    // send image by getting data uri
    // const DataURI = require("datauri").promise;
    // DataURI(req.file.path)
    //     .then(content => {
    //         res.render('image', {file: content});
    //         res.end();
    //     })
    //     .catch(err => { throw err; });

    // send image by relative path
    // res.render('image', {file: path.join("..", "uploads", req.file.filename)});
    // res.end();
});

function readTextFile(path)
{

}

module.exports = router;
