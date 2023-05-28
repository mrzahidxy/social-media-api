const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.PASS_SEC_KEY
  ).toString();

  const newUser = new user({ username, email, password: encryptedPassword });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await user.findOne({ username });

    if (!foundUser) {
      return res.status(401).json("User not found!");
    }

    const orginalPasswordBytes = CryptoJS.AES.decrypt(
      foundUser.password,
      process.env.PASS_SEC_KEY
    );
    const orginalPassword = orginalPasswordBytes.toString(CryptoJS.enc.Utf8);

    if (orginalPassword !== password) {
      return res.status(401).json("Wrong password!");
    }

    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
      process.env.JWT_SEC_KEY,
      {
        expiresIn: "3d",
      }
    );

    res.status(200).json({ ...foundUser._doc, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
