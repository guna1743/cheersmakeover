const express= require('express');
const User = require('../models/User');
const router= express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//user model
const user=require('../models/User');


// router.get('/dashboard',(req,res)=>res.render("dashboard"));

//Login page
//router.get('/login',(req,res)=>res.render("login"));

router.get('/homepage',(req,res)=>res.render("homepage"));

//Register page
router.get('/register',(req,res)=>res.render("register",{page:"register"}));

//Registr Handle
router.post('/register',(req,res)=>{
  console.log("hello")
    /*console.log(req.body)
    res.send('hello');*/
    const { name,email,password,password2 }=req.body;
    let errors=[];
     
    //check required fields

    if(!name || !email || !password ||!password2){
        errors.push({msg:'Please fill in all fields'});
    }

    //check password martch
    if(password!==password2){
        errors.push({msg:'Passwords do not match'});
    }

    //check password length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'});
    }
    console.log(errors) 
    var page="register" 
    if(errors.length > 0){
       res.render('login',{
          page,
          errors,
          name,
          email,
          password,
          password2
       });
    }
    else{
       //validation passed
       User.findOne({ email:email }) 
       .then(user =>{
        if(user){
           
            //User exists
            var page="register"
            errors.push({msg:'Email is already registered'});
            res.render('login',{
              page,
                errors,
                name,
                email,
                password,
                password2
             });
        }
        else{
          const newUser=new User({
            name,
            email,
            password
          });
         
          //Hash password
          bcrypt.genSalt(10, (err,salt)=> 
            bcrypt.hash(newUser.password,salt, (err,hash)=>{
                if(err) throw err;
                //set password to hashed
                newUser.password=hash;
                //save user
                newUser.save()
                  .then(user =>{
                    req.flash('success_msg','You are now registered and can log in');
                    res.redirect('/');
                  })
                  .catch(err => console.log(err));
                  

          }))
        }
       });
    } 
});

//Login handle
// router.get('/dashboard',(req,res)=>res.render("dashboard"));
router.post('/login',(req,res,next)=>{
  console.log(req.body.email);
  let email=req.body.email;
  
  User.findOne({ email:email}) 
  .then(user =>{
    var page="login"
    let errors=[]
    errors.push({msg:'Email is not registered'});
if(!user)
res.render('login',{page,errors,password:req.body.password});


console.log("password in hashFormat:"+user.password);

var salt = bcrypt.genSaltSync(10);

  /** Encrypt password */
    compare(user.password)

/** Compare stored password with new encrypted password */
function compare(encrypted) {
  console.log(req.body.password)
    bcrypt.compare(req.body.password, encrypted, (err, res) => {
        // res == true or res == false
        console.log('Compared result', res) 
    direct(res);
    });
}
function direct(ans){
  if(ans){
    if(req.body.email=="admin@gmail.com"){
    console.log('admin password correct User')
    res.redirect('/adminpage')
    }
    else{

      User.findOne({ email:email }) 
      .then(user =>{
       if(user){
    console.log('user password correct Login'+user.name)

    res.render('dashboard',{name:user.name});
       }
      })
    }
    
}
else
{
  console.log("hello1")
           
           
             
 
}
}
  });

  
  // res.write();

 
    // passport.authenticate('local',{
    //     successRedirect:'/dashboard',
        
    //     failureFlash:true
    // })(req,res,next);

});


//Logout handle
/*router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');

});*/


router.get('/logout', (req, res, next) =>{
    req.logout((err) => {
      if (err) { return next(err); }
      else{
        req.flash('success_msg','You are logged out');
      }
      res.redirect('/');
    });
  });

  



module.exports=router;