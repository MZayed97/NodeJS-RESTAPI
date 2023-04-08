const router = require("express").Router();
const posts = require("../models/posts");

router.get("/", (req, res) => {
  console.log("done");
});

// create new post
router.post("/create", async (req, res) => {
  const newPost = new posts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// update post 
router.put("/:id", async (req,res)=>{
    try {
        const currentPost = await posts.findById(req.params.id)
        if (currentPost.userId === req.body.userId){
            await posts.updateOne({$set:req.body})
            res.status(200).send("post has be updated")
        }else{
            return res.status(400).send("you can't update this post")
        }
    } catch (err) {
        
    }
})


module.exports = router;
