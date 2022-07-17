const express= require('express');
const router= express.Router();
const axios=require('axios');
const { ensureAuthenticated }=require('../config/auth');
const Userdb = require('../models/model');

//for page router

router.get('/userpage',(req,res)=>{
   //make a get request to /api/users
   axios.get('https://cheers-makeover.herokuapp.com/api/users',{params:{id:req.query.id}})
     .then(function(response){
        res.render("userpage",{users:response.data});
     })
     .catch(err=>{
      res.send(err);
     })
   
});


//for admin page route


router.get('/adminpage',(req,res)=>{
   //make a get request to /api/users
   axios.get('https://cheers-makeover.herokuapp.com/api/users')
     .then(function(response){
      console.log(response)
        res.render("adminpage",{users:response.data});
     })
     .catch(err=>{
      res.send(err);
     })
   
});






//

router.get('/userform',(req,res)=>res.render("userform"));
router.get('/update-user',(req,res)=>{
   axios.get('https://cheers-makeover.herokuapp.com/api/users',{params:{id:req.query.id}})
     .then(function(userdata){
      res.render("userupdate",{user:userdata.data})
     })
     .catch(err=>{
      res.send(err);
     })
});



//crud operations router

//create and save new server

router.post('/api/users',(req,res)=>{
  //validate request

  if(!req.body){
   res.status(400).send({ message:"Content cannot be empty"});
   return;
  }

  //new user
  const date=req.body.date.split("T")[0];
  console.log(date);
  const user=new Userdb({
   name:req.body.name,
   email:req.body.email,
   services:req.body.services,
   date:date,
   time:req.body.time,
   phoneno:req.body.phoneno,
   stylist:req.body.stylist
  })

  //save user in the database

  user
    .save(user)
    .then(data=>{
      // res.send(data)
      res.redirect('/userpage');
    })
    .catch(err=>{
      res.status(500).send({message:err.message || "Some error occured while creating a create operation"})
    });

});   

//retrieve and return all users / return and retrieve a single user

router.get('/api/users',(req,res)=>{
   if(req.query.id){
      const id=req.query.id;
      Userdb.findById(id)
        .then(data=>{
         if(!data){
            res.status(404).send({message:"Not found user with id"+id})
         }
         else{
            res.send(data)
         }
        })
        .catch(err=>{
         res.status(500).send({message:"Error retrieving user with id"+id})
        })
   }
   else{
      Userdb.find()
   .then(user=>{
      res.send(user)
   })
   .catch(err=>{
      res.status(500).send({message:err.message || "Error Occurred while retrieving user information"})
   })
   }
}); 

//update a new identified user by user id

router.put('/api/users/:id',(req,res)=>{
   if(!req.body){
      return res
        .status(400)
        .send({message:"Data to update can not be empty"})
   }

   const id=req.params.id;
   Userdb.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
     .then(data=>{
      if(!data)
      {
         res.status(404).send({message:'Cannot Update user with ${id}.Maybe user not found!'})
      }
      else{
         res.send(data)
      }
     })
     .catch(err=>{
      res.status(500).send({message:"Error Update user information"})
     })
}); 

//delete a user with specified user id

router.delete('/api/users/:id',(req,res)=>{
const id=req.params.id;
console.log(id)
Userdb.findByIdAndDelete(id)
  .then(data=>{
   if(!data)
   {
      res.status(404).send({message:'Cannot Delete with ${id}.Maybe id is wrong'})
   }
   else{
      res.send({
         message:"User was deleted successfully!"
      })
   }
  })
  .catch(err=>{
   res.status(500).send({message:"Could not delete user with id="+id});
  });
});






//Welcome Page
router.get('/',(req,res)=>res.render("login",{page:"login"}));




//dashboard page
router.get('/dashboard',(req,res)=>{
   console.log(req.body)
   res.render('dashboard',{name:req.body.name})
   
});

   




module.exports=router;