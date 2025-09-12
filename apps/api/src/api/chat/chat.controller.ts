import { NextFunction, Request, Response } from "express";
import { IConversationReq, IUserDoc, IEditMessageReq } from "interfaces";
import { ConversationModel, MessageModel } from "~/api/chat/models";
import UserModel from "../user/user.model";
import { KeyModel } from "../key/key.model";

const controller = {
  //Create a new conversation between two users
  async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { receiverId, receiverPublicKey }: IConversationReq = req.body;

      if (!receiverId) {
        return res.status(400).json({
          message: "Receiver id is required",
        });
      }

      if (!receiverPublicKey) {
        return res.status(400).json({
          message: "Receiver's public key is required to start a conversation",
        });
      }

      if (receiverId === req.user!._id) {
        return res.status(400).json({
          message: "You cannot send a message to yourself",
        });
      }

      //check is the receiverId is a valid user
      const receiver = await UserModel.findById(receiverId);

      if (!receiver) {
        return res.status(400).json({
          message: "Receiver id is not valid",
        });
      }

      //Check if current user is blocked by the receiver or vice versa
      const currentUser = await UserModel.findById(req.user!._id);
      const isBlockedByReceiver = receiver.blockedUsers?.includes(req.user!._id as any);
      const hasBlockedReceiver = currentUser?.blockedUsers?.includes(receiverId as any);

      if (isBlockedByReceiver || hasBlockedReceiver) {
        return res.status(403).json({
          message: "Unable to start conversation. User may be blocked.",
        });
      }

      // Verify the provided public key matches the receiver's actual public key
      const receiverKey = await KeyModel.findOne({ userId: receiverId });
      
      if (!receiverKey) {
        return res.status(400).json({
          message: "Receiver has not set up encryption keys",
        });
      }

      if (receiverKey.publicKey.trim() !== receiverPublicKey.trim()) {
        return res.status(400).json({
          message: "Invalid public key provided for the receiver",
        });
      }

      //check if conversation already exists
      const existingConversation = await ConversationModel.findOne({
        participants: {
          $all: [req.user!._id, receiverId],
        },
      });

      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }

      const conversation = await ConversationModel.create({
        participants: [req.user!._id, receiverId],
      });

      res.status(201).json(conversation);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  async getConversationList(req: Request, res: Response, next: NextFunction) {
    try {
      //Get all conversations where the current user is a participant
      const conversations = await ConversationModel.find({
        participants: {
          $in: [req.user!._id],
        },
      }).populate<IUserDoc>({
        path: "participants",
        select: {
          name: 1,
          username: 1,
          email: 1,
        },
      });

      res.status(200).json(conversations);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Get a conversation by id
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;

      //Get all messages from a conversation
      const messages = await MessageModel.find({
        conversationId,
      });

      res.status(200).json(messages);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Send a message to a conversation
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const { content, senderContent } = req.body;

      if (!content || !senderContent) {
        return res.status(400).json({
          message: "Sender and receiver content is required",
        });
      }

      //Get conversation
      const conversation = await ConversationModel.findById(conversationId).populate('participants');

      if (!conversation) {
        return res.status(400).json({
          message: "Conversation not found",
        });
      }

      //Check if users are blocked
      const participants = conversation.participants as any[];
      const otherParticipant = participants.find(p => p._id.toString() !== req.user!._id.toString());
      
      if (otherParticipant) {
        const currentUser = await UserModel.findById(req.user!._id);
        const isBlockedByOther = otherParticipant.blockedUsers?.includes(req.user!._id as any);
        const hasBlockedOther = currentUser?.blockedUsers?.includes(otherParticipant._id as any);

        if (isBlockedByOther || hasBlockedOther) {
          return res.status(403).json({
            message: "Unable to send message. User may be blocked.",
          });
        }
      }

      //Create a new message
      const newMessage = await MessageModel.create({
        conversationId,
        senderId: req.user!._id,
        content,
        senderContent,
      });

      res.status(201).json(newMessage);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Edit a message
  async editMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;
      const { content, senderContent }: IEditMessageReq = req.body;

      if (!content || !senderContent) {
        return res.status(400).json({
          message: "Content and sender content are required",
        });
      }

      //Update the message (validation done in middleware)
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        {
          content,
          senderContent,
          isEdited: true,
          editedAt: new Date(),
        },
        { new: true }
      );

      res.status(200).json(updatedMessage);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  //Delete a message
  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { messageId } = req.params;

      //Mark message as deleted (validation done in middleware)
      const deletedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        {
          isDeleted: true,
          content: "This message has been deleted",
          senderContent: "This message has been deleted",
        },
        { new: true }
      );

      res.status(200).json(deletedMessage);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  },
};

export { controller as chatController };
