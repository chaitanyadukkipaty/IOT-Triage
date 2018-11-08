var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var swig = require('swig');
var uid = require('./models/user');
var data = require('./models/application');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var config = require('./config');
const app = express()
var mongoose = require('mongoose');
//swig.setDefaults({varControls:['<%=','%>']})

/*
* Connect to database
*
*/
mongoose.connect('mongodb://localhost/iot');

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/add',(req,res)=>{
  uid.findOne({}, function (err, u) {
    if (err) return console.error(err);
    else if(u==null)
    res.render('card',{
      uid : ""
     })
    else if (u!=null){
      x=u.uid
      console.log(x)
     data.findOne({uid : x},function(err,dat){
      //console.log(dat)
      //console.log(u.uid)
      if (err) return console.error(err);
       else if(dat!=null){
         res.render('data',{
          uid : dat.uid
         })
       }
       else{
        res.render('add',{
          uid : u.uid
         })
       }
     })
    }
  });
});

app.post('/add',(req,res)=>{
  console.log(req.body)
  data.deleteOne({uid : req.body.uid}, function (err) {
    if (err) return console.error(err);
  });
  res.redirect('/add');

})
app.get('/',(req,res)=>{
    data.find({},function(err,dat){
        if(err) return console.error(err)
        else
        {
          res.render('home',{
            data : dat
          })
        }
    })
   // res.render('home')
});


app.get('/view',(req,res)=>{
  uid.findOne({}, function (err, u) {
    if (err) return console.error(err);
    else if(u==null){
      res.render('card')
    }
    else{
      data.findOne({uid : u.uid},function(err0r,dat){
        if (err0r) return console.error(err0r);
        else if(dat==null)
        {
          res.render('empty')
        }
        else{
            res.render('view',{
            data : dat
           })
          console.log(dat)
          uid.deleteOne({}, function (err) {
            if (err) return console.error(err);
          });
        }
      })
    }
  })
})
app.post('/view',(req,res)=>{
  console.log(req.body.uid)
  data.deleteOne({uid : req.body.uid}, function (err) {
    if (err) return console.error(err);
  });
  res.redirect('/');

})

app.post('/delete',(req,res)=>{
  console.log(req.body.uid)
  uid.deleteOne({uid : req.body.uid}, function (err) {
    if (err) return console.error(err);
  });
  res.redirect('/');

})

app.post('/views',(req,res)=>{
  console.log(req.body)
  uid.deleteOne({}, function (err) {
    if (err) return console.error(err);
  });
  var per = new data(req.body)
  per.save(function (err, tx) {
    if (err) return console.error(err);
    });
    
    res.render('view',{
      data : per
     })
})

app.post('/',(req,res)=>{
 // console.log("heyp")
  console.log(req.body)
  console.log('\u0007');
  var tx = new uid();
    tx.uid=req.body.Uid;
		console.log(tx.uid)
		tx.save(function (err, tx) {
			if (err) return console.error(err);
		  });
  res.sendStatus(200)
})
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    // res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  // res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000)

