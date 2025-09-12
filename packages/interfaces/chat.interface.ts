import {
  SchemaTimestampsConfig,
  Types,
  Document,
  PopulatedDoc,
} from "mongoose";
import { IUserDoc } from "./user.interface";
import { Message } from "./socket.interface";

export interface IConversation extends SchemaTimestampsConfig {
  participants: PopulatedDoc<Document<Types.ObjectId> & IUserDoc>;
}

export interface IConversationDoc extends Document, IConversation {}

export interface IMessage extends SchemaTimestampsConfig, Message {
  conversationId: PopulatedDoc<Document<Types.ObjectId> & IConversationDoc>;
  senderId: PopulatedDoc<Document<Types.ObjectId> & IUserDoc>;
  isDeleted?: boolean;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface IMessageDoc extends Document, IMessage {}

export interface IConversationReq {
  receiverId: string;
  receiverPublicKey: string; // Required public key of the receiver
}

export type IConversationRes = IConversationDoc[];

export interface ISendMessageReq extends Message {
  conversationId: string;
}

export interface IEditMessageReq {
  content: string;
  senderContent: string;
}

export interface IDeleteMessageReq {
  messageId: string;
}
