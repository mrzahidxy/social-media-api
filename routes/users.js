const user = require("../models/user");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    let User = userId
      ? await user.findById(userId)
      : await user.findOne({ username: username });
    const { password, updatedAt, ...other } = User?._doc;

    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
