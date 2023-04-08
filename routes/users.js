const router = require("express").Router()
const User = require("../models/users")


//Register 
router.get("/", async (req,res)=>{
    const user = new User({
        username:"mostafa",
        email:"mostafa@ddd.cc",
        password:"36320154",
        isAdmin:false
    });
   await user.save()
   res.send("the user created cheack")
}
)


router.post("/",async (req,res)=>{
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    })

    try{
        const user = await newUser.save()
        res.status(201).json()
    }catch (error){
         console.error(error);
         res.status(400).json()
    }
})

module.exports = router