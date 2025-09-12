import {
	Button,
	Group,
	Input,
	Stack,
	Text,
	Box,
	useMantineTheme,
	Popover,
	ActionIcon,
	Center,
	Badge,
	ThemeIcon,
	Menu,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '~/features/auth';
import { ChatBubble, useChat, useSocket } from '~/features/chat';
import { UserAvatar } from '~/features/common';
import { blockUser, unblockUser, getBlockedUsers } from '~/utils/request';
import { showErrorMessage, showSuccessMessage } from '~/utils/errorHandler';
import {
	Lock,
	MoodHappy,
	DotsVertical,
	UserMinus,
	UserCheck,
} from 'tabler-icons-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { ParsedKeyView } from '~/features/key/components/ArmoredKeyView/ParsedKeyView';

// Type definitions for socket events
interface GetMessageData {
	senderId: string;
	content: string;
	senderContent: string;
	conversationId: string;
}

interface GetEditMessageData {
	senderId: string;
	messageId: string;
	content: string;
	senderContent: string;
	conversationId: string;
	isEdited: boolean;
	editedAt: Date;
}

interface GetDeleteMessageData {
	senderId: string;
	messageId: string;
	conversationId: string;
	isDeleted: boolean;
	content: string;
	senderContent: string;
}

export default function Home() {
	let init = false;
	[];
	const theme = useMantineTheme();
	const { socket } = useSocket();
	const [value, setValue] = useState('');
	const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
	const {
		conversationItem,
		messages,
		sendMessage,
		setMessages,
		receiverPublicKey,
		conversationId,
		updateMessageList,
		updateConversationList,
	} = useChat();
	const { user } = useAuth();

	useEffect(() => {
		if (socket && !init) {
			/**
			 * When we receive a message from the socket server for real time chat
			 * We update the message list
			 */
			socket.on('getMessage', (receivedMessage: GetMessageData) => {
				console.log('[Get message from socket]', receivedMessage);

				//Check if the message is for the current conversation
				setMessages((prev) => [
					...prev,
					{
						...receivedMessage,
						createdAt: Date.now(),
					},
				]);
			});

			/**
			 * When we receive an edit message event from the socket server
			 * We update the corresponding message in the list
			 */
			socket.on('getEditMessage', (editedMessage: GetEditMessageData) => {
				console.log('[Get edit message from socket]', editedMessage);

				setMessages((prev) =>
					prev.map((msg) =>
						msg._id === editedMessage.messageId
							? {
									...msg,
									content: editedMessage.content,
									senderContent: editedMessage.senderContent,
									isEdited: true,
									editedAt: editedMessage.editedAt,
								}
							: msg
					)
				);
			});

			/**
			 * When we receive a delete message event from the socket server
			 * We update the corresponding message in the list
			 */
			socket.on('getDeleteMessage', (deletedMessage: GetDeleteMessageData) => {
				console.log('[Get delete message from socket]', deletedMessage);

				setMessages((prev) =>
					prev.map((msg) =>
						msg._id === deletedMessage.messageId
							? {
									...msg,
									content: deletedMessage.content,
									senderContent: deletedMessage.senderContent,
									isDeleted: true,
								}
							: msg
					)
				);
			});

			/**
			 * When we receive a refresh conversations event
			 * We update the conversation list to show new conversations
			 */
			socket.on('refreshConversations', () => {
				console.log('[Refresh conversations from socket]');

				if (updateConversationList) {
					updateConversationList();
				}
			});

			// eslint-disable-next-line react-hooks/exhaustive-deps
			init = true;
		}

		return () => {
			socket?.off('getMessage');
			socket?.off('getEditMessage');
			socket?.off('getDeleteMessage');
			socket?.off('refreshConversations');
		};
	}, [socket]);

	// Fetch blocked users on component mount
	useEffect(() => {
		const fetchBlockedUsers = async () => {
			try {
				const blocked = await getBlockedUsers();
				setBlockedUsers(blocked.map((user: any) => user._id));
			} catch (error) {
				console.error('Failed to fetch blocked users:', error);
			}
		};

		if (user) {
			fetchBlockedUsers();
		}
	}, [user]);

	// Check if current conversation partner is blocked
	const isUserBlocked = conversationItem
		? blockedUsers.includes(conversationItem.receiver._id)
		: false;

	const handleSendMessage = async () => {
		if (socket && conversationItem && value.trim() && !isUserBlocked) {
			const messageToSend = value.trim();
			setValue(''); // Clear input immediately

			try {
				await sendMessage(messageToSend);
				// Input remains cleared on success
			} catch (error: any) {
				// Show user-friendly error message
				showErrorMessage(error, 'Failed to send message. Please try again.');
				// Restore the message value so user can try again
				setValue(messageToSend);
			}
		} else if (isUserBlocked) {
			// Show error if trying to send to blocked user
			showErrorMessage(
				null,
				'Cannot send messages to blocked users. Unblock them first.'
			);
		}
	};

	const handleBlockUser = async () => {
		if (conversationItem) {
			try {
				await blockUser(conversationItem.receiver._id);
				setBlockedUsers((prev) => [...prev, conversationItem.receiver._id]);

				// Refresh the conversation list to reflect blocking status
				if (updateConversationList) {
					await updateConversationList();
				}

				showSuccessMessage('User blocked successfully');
				// Optionally redirect or refresh conversation list
			} catch (error) {
				console.error('Failed to block user:', error);
				showErrorMessage(error, 'Failed to block user');
			}
		}
	};

	const handleUnblockUser = async () => {
		if (conversationItem) {
			try {
				await unblockUser(conversationItem.receiver._id);
				setBlockedUsers((prev) =>
					prev.filter((id) => id !== conversationItem.receiver._id)
				);

				// Refresh the message list to show previously hidden messages
				if (updateMessageList) {
					await updateMessageList();
				}

				// Refresh the conversation list to reflect unblocking status
				if (updateConversationList) {
					await updateConversationList();
				}

				showSuccessMessage('User unblocked successfully');
			} catch (error) {
				console.error('Failed to unblock user:', error);
				showErrorMessage(error, 'Failed to unblock user');
			}
		}
	};

	const conversationPlaceholder = (
		<Center className='flex-1'>
			<Badge color='blue'>Select a conversation to start messaging</Badge>
		</Center>
	);

	const conversationContent = (
		<>
			<Box
				className='sticky bg-black top-[70px] z-[2]'
				style={{
					background:
						theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
					borderBottom: `0.5px solid ${
						theme.colorScheme === 'dark'
							? theme.colors.dark[4]
							: theme.colors.gray[4]
					}`,
				}}
				px='md'
				py='sm'
			>
				{conversationItem && (
					<Group position='apart'>
						<Group>
							<UserAvatar user={conversationItem.receiver} />
							<div>
								<Text size='md' weight={500}>
									{conversationItem.receiver.name}
								</Text>
								<Text size='sm' color='dimmed'>
									{conversationItem.receiver.username}
								</Text>
							</div>
						</Group>

						<Group spacing='xs'>
							<Popover width={500} position='bottom' withArrow shadow='md'>
								<Popover.Target>
									<ActionIcon variant='default'>
										<Lock size={18} />
									</ActionIcon>
								</Popover.Target>
								<Popover.Dropdown>
									<Stack className='overflow-auto max-h-[500px]'>
										<Text className='text-green-500' weight={500}>
											End-to-end encryption
										</Text>
										<Text>
											{conversationItem.receiver.name}&apos;s public key:
										</Text>
										<div>
											<ParsedKeyView armoredKey={receiverPublicKey} />
										</div>
										<Text className='break-words' size='sm'>
											{receiverPublicKey}
										</Text>
									</Stack>
								</Popover.Dropdown>
							</Popover>

							<Menu position='bottom-end'>
								<Menu.Target>
									<ActionIcon variant='default'>
										<DotsVertical size={18} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									{isUserBlocked ? (
										<Menu.Item
											icon={<UserCheck size={14} />}
											color='green'
											onClick={handleUnblockUser}
										>
											Unblock User
										</Menu.Item>
									) : (
										<Menu.Item
											icon={<UserMinus size={14} />}
											color='red'
											onClick={handleBlockUser}
										>
											Block User
										</Menu.Item>
									)}
								</Menu.Dropdown>
							</Menu>
						</Group>
					</Group>
				)}
			</Box>

			<Box px='sm' className='pb-4 grow min-h-min'>
				<Stack>
					{isUserBlocked ? (
						<Center className='flex-1 py-8'>
							<Stack align='center' spacing='sm'>
								<ThemeIcon size='xl' color='red' variant='light'>
									<UserMinus size={24} />
								</ThemeIcon>
								<Text color='dimmed' align='center'>
									You have blocked this user. Messages are hidden.
								</Text>
								<Text size='sm' color='dimmed' align='center'>
									Unblock them to see messages and continue the conversation.
								</Text>
							</Stack>
						</Center>
					) : (
						messages.map((message, i) =>
							conversationId === message.conversationId ? (
								<ChatBubble
									key={message._id || `${message.senderContent}-${i}`}
									message={message}
									isSender={user?.id === message.senderId}
									isLast={i === messages.length - 1}
								/>
							) : null
						)
					)}
				</Stack>
			</Box>

			<Box
				px='sm'
				className='sticky bottom-0 py-4'
				style={{
					background:
						theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
				}}
			>
				{isUserBlocked ? (
					<Group spacing='xs'>
						<Input
							disabled
							className='flex-1'
							placeholder='You cannot send messages to blocked users'
							value=''
						/>
						<Button disabled>Send</Button>
					</Group>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSendMessage();
						}}
					>
						<Group spacing='xs'>
							<Popover width={450} shadow='md'>
								<Popover.Target>
									<ActionIcon size='lg'>
										<MoodHappy size={18} />
									</ActionIcon>
								</Popover.Target>
								<Popover.Dropdown
									className='bg-transparent border-0'
									px={0}
									pb={5}
									pt={0}
								>
									<EmojiPicker
										width='100%'
										theme={Theme.DARK}
										onEmojiClick={(emojiData, e) => {
											setValue(value + emojiData.emoji);
										}}
									/>
								</Popover.Dropdown>
							</Popover>

							<Input
								required
								onChange={(e: React.FormEvent<HTMLInputElement>) =>
									setValue(e.currentTarget.value)
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage();
									}
								}}
								value={value}
								className='flex-1'
								placeholder='Message'
							/>

							<Button type='submit'>Send</Button>
						</Group>
					</form>
				)}
			</Box>
		</>
	);
	return (
		<Stack className='min-h-full'>
			{conversationItem ? conversationContent : conversationPlaceholder}
		</Stack>
	);
}
