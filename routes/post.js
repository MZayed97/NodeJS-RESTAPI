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
router.put("/:id", async (req, res) => {
  try {
    const currentPost = await posts.findById(req.params.id);
    if (currentPost.userId === req.body.userId) {
      await posts.updateOne({ $set: req.body });
      res.status(200).send("post has be updated");
    } else {
      return res.status(400).send("you can't update this post");
    }
  } catch (err) {}
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
      const deletedPost = await posts.findById(req.params.id);
      if (deletedPost.userId === req.body.userId){
        await deletedPost.deleteOne()
        return res.status(200).send("post have been deleted")
      }else{
        return res.status(400).send("you can't delete this post")
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error")
    }

});

//like a post 

router.put("/:id/like", async (req, res) => {
  try {
    const post = await posts.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
