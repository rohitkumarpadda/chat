import { createContext, Dispatch, SetStateAction } from 'react';
import { KeyedMutator } from 'swr';
import { PgpDecryptDetails, PgpEncryptDetails } from '~/utils/crypto';
import { IConversationRes as IConversationResAPI } from 'interfaces';

// Simple user type for frontend use (without Mongoose Document properties)
export interface IUser {
	_id: string;
	name: string;
	username: string;
	email: string;
}

export interface IConversationItem {
	id: string;
	receiver: IUser;
}

export interface IMessageItem {
	_id?: string;
	content: string;
	senderContent: string;
	conversationId: string;
	senderId: string;
	isDeleted?: boolean;
	isEdited?: boolean;
	editedAt?: Date | string;
	/**
	 * Original message content of the user send out, so we don't need to decrypt it again
	 * when we want to display it
	 */
	originalSendContent?: {
		content: string;
		encryptDetailsForSender: PgpEncryptDetails;
		encryptDetailsForReceiver: PgpEncryptDetails;
	};
	createdAt: Date | string | number;
}

export interface DecryptMessage {
	message: string;
	details?: PgpDecryptDetails;
}

export interface ChatContextProps {
	conversationId?: string;
	setConversationId: (id: string) => void;
	conversationItem: IConversationItem | undefined;
	getConversation: (id?: string) => IConversationItem | undefined;
	conversations: IConversationItem[];
	updateConversationList: KeyedMutator<IConversationResAPI>;
	updateMessageList: KeyedMutator<any>;
	conversationListLoading: boolean; // loading state for conversation list
	sendMessage: (content: string) => void;
	editMessage: (messageId: string, content: string) => Promise<void>;
	deleteMessage: (messageId: string) => Promise<void>;
	setMessages: Dispatch<SetStateAction<IMessageItem[]>>;
	messages: IMessageItem[];
	receiverPublicKey?: string; //The public key of the receiver
	decryptReceivedMessage: (message: string) => Promise<DecryptMessage>; // Decrypt the received message
	decryptSentMessage: (message: string) => Promise<DecryptMessage>; // Decrypt the sent out message
	messageListLoading: boolean; // loading state for message list
}

export const ChatContext = createContext<ChatContextProps>(undefined!);
