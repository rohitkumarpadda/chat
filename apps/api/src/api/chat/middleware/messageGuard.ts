import { NextFunction, Request, Response } from "express";
import { MessageModel } from "../models";

/**
 * Middleware to check if the user has access to the message
 * Only the sender of the message can edit or delete it
 */
export const messageGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the current user is the sender of the message
    if (message.senderId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ 
        message: "You can only modify your own messages" 
      });
    }

    // Check if the message is already deleted for edit operations
    if (req.method === "PUT" && message.isDeleted) {
      return res.status(400).json({
        message: "Cannot edit a deleted message",
      });
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
