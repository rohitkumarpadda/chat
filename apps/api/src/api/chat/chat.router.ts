import { Router } from "express";
import passport from "passport";
import { chatController } from "./chat.controller";
import { conversationGuard, messageGuard } from "./middleware";
const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/conversations", chatController.createConversation);

router.get("/conversations", chatController.getConversationList);

router.get(
  "/messages/:conversationId",
  conversationGuard,
  chatController.getMessages
);

router.post(
  "/messages/:conversationId",
  conversationGuard,
  chatController.sendMessage
);

//Edit a message
router.put("/messages/:messageId", messageGuard, chatController.editMessage);

//Delete a message
router.delete("/messages/:messageId", messageGuard, chatController.deleteMessage);  

export { router as chatRouter };
