const conversation = require("../models/conversation");
const { verifyToken } = require("./verification");
const router = require("express").Router();

//* New conversations

router.post("/", verifyToken, async (req, res) => {
  const newConversation = new conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//* Conversations by user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    console.log(req.params.userId);
    const foundConversation = await conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(foundConversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//* Conversations between two users
router.get(
  "/find/:firstUserId/:secondUserId",
  verifyToken,
  async (req, res) => {
    try {
      const foundConversations = await conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      return res.status(200).json(foundConversations);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
