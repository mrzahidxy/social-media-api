const message = require("../models/message");
const { verifyToken } = require("./verification");
const router = require("express").Router();

//* New message

router.post("/", verifyToken, async (req, res) => {
  const newMessage = new message(req.body);
  try {
    const savedMessage = await newMessage.save();
    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//* messages

router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
