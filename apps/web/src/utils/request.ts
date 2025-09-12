import { axiosInstance } from "./axios";
import {
  IConversation,
  IConversationDoc,
  IConversationRes,
  ILoginReq,
  ILoginRes,
  IMessageDoc,
  IRegisterReq,
  ISearchRes,
  ISearchItem,
  ISendMessageReq,
} from "interfaces";
import { escapeSearchTerm } from "./ui";

export const register = async (data: IRegisterReq) => {
  const result = await axiosInstance.post("/auth/register", data);

  return result.data;
};

export const login = async (data: ILoginReq) => {
  const result = await axiosInstance.post<ILoginRes>("/auth/login", data);

  return result.data;
};

export const logout = async () => {
  const result = await axiosInstance.get("/auth/logout");

  return result.data;
};

export const searchUsersSWR = (_key: string, query: string) => {
  return searchUsers(query);
};

export const searchUsers = async (query: string) => {
  const result = await axiosInstance.get<ISearchRes>(
    `/user/search${query ? `?q=${escapeSearchTerm(query)}` : ""}`
  );

  return result.data;
};

export const startConversation = async (receiverId: string, receiverPublicKey: string) => {
  const result = await axiosInstance.post<IConversationDoc>(
    "/chat/conversations",
    {
      receiverId,
      receiverPublicKey,
    }
  );

  return result.data;
};

export const getConversationList = async () => {
  const result = await axiosInstance.get<IConversationRes>(
    "/chat/conversations"
  );

  return result.data;
};

//Get all messages in a conversation
const getMessageList = async (conversationId: string) => {
  const result = await axiosInstance.get<IMessageDoc[]>(
    `/chat/messages/${conversationId}`
  );

  return result.data;
};

export const getMessageListSWR = (_key: string, conversationId: string) => {
  return getMessageList(conversationId);
};

//Send a message
export const sendMessage = async ({
  conversationId,
  senderContent,
  content,
}: ISendMessageReq) => {
  const result = await axiosInstance.post<IConversation>(
    `/chat/messages/${conversationId}`,
    {
      senderContent,
      content,
    }
  );

  return result.data;
};

//Edit a message
export const editMessage = async (messageId: string, content: string, senderContent: string) => {
  const result = await axiosInstance.put<IMessageDoc>(
    `/chat/messages/${messageId}`,
    {
      content,
      senderContent,
    }
  );

  return result.data;
};

//Delete a message
export const deleteMessage = async (messageId: string) => {
  const result = await axiosInstance.delete<IMessageDoc>(
    `/chat/messages/${messageId}`
  );

  return result.data;
};

//Block a user
export const blockUser = async (userId: string) => {
  const result = await axiosInstance.post(
    `/user/block`,
    { userId }
  );

  return result.data;
};

//Unblock a user
export const unblockUser = async (userId: string) => {
  const result = await axiosInstance.post(
    `/user/unblock`,
    { userId }
  );

  return result.data;
};

//Get blocked users
export const getBlockedUsers = async () => {
  const result = await axiosInstance.get<ISearchItem[]>(
    `/user/blocked`
  );

  return result.data;
};

export const getMessages = async (conversationId: string) => {
  const result = await axiosInstance.get(`/chat/messages/${conversationId}`);

  return result.data;
};

export const getProfile = async () => {
  const result = await axiosInstance.get(`/user/me`);

  return result.data;
};

//Set the public key for the user
export const setPublicKey = async (publicKey: string) => {
  const result = await axiosInstance.post(`/key/public-key`, {
    publicKey,
  });

  return result.data;
};

//Get the public key for a user
export const getPublicKey = async (userId: string) => {
  const result = await axiosInstance.get<{
    publicKey?: string;
  }>(`/key/public-key/${userId}`);

  return result.data.publicKey;
};

export const getPublicKeySWR = (_key: string, userId: string) => {
  return getPublicKey(userId);
};
