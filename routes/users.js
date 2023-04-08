const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("the user created cheack");
});

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send("validation Error");
    console.error(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    !foundUser && res.status(403).send("email not found");

    const samePassword = await bcrypt.compare(
      foundUser.password,
      req.body.password
    );
    !samePassword && res.status(400).send("wrong password");

    res.status(200).send("correct user and password");
  } catch (err) {
    res.status(400).send("valdiation error");
    console.error(err);
  }
});

// update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("accound delleterd");
    } catch (err) {
      console.log(err);
      return res.status(500).json("server error");
    }
  } else {
    return res.status(400).json("you can't delete this user no authinticated");
  }
});

// get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json("user not found ");
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("server error");
  }
});

// followings

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId);
      const secondUser = await User.findById(req.params.id);
      if (!secondUser.followers.includes(req.body.userId)) {
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        await secondUser.updateOne({ $push: { followers: req.body.userId } });

        res.status(200).json("you followed him");
      } else {
        res.status(403).json("you already follow him");
      }
    } catch (error) {}
  } else {
    res.status(403).json("you are trying to follow yourself");
  }
});
// unfollow
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const currentUser = await User.findById(req.body.userId);
        const secondUser = await User.findById(req.params.id);
        if (secondUser.followers.includes(req.body.userId)) {
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          await secondUser.updateOne({ $pull: { followers: req.body.userId } });

          res.status(200).json("you unfollowed him");
        } else {
          res.status(403).json("you can't infollow him");
        }
      } catch (error) {}
    } else {
      res.status(403).json("you are trying to unfollow yourself");
    }
  });

module.exports = router;
