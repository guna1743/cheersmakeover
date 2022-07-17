const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const mongoose=require('mongoose');
const morgan=require('morgan');
const path = require('path')

const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

const app = express();




//passport config

require('./config/passport')(passport);

//DB config

const db=require('./config/keys').MongoURI;

//connect to mongo

mongoose.connect("mongodb+srv://guna:guna@cluster0.kjpqh.mongodb.net/?retryWrites=true&w=majority" )
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));




//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

//Bodyparser
app.use(express.urlencoded({ extended:false}));
// app.use(express.static("public")); 
app.use(express.static(path.join(__dirname, 'public')))


//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //connect flash

  app.use(flash());

  //global vars

  app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
  });

//Routes

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));



const PORT = process.env.PORT || 9000;

app.listen(PORT,console.log(`Listening on port ${PORT}`));