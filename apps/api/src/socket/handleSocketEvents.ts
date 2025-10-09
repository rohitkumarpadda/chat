import { Socket } from 'socket.io';
import { verifyJWT } from '~/utils/jwt';
import { SocketClient, SocketServer } from 'interfaces';

//key value pair of  user id and socket.id
const users: {
	[socketId: string]: string;
} = {};

const addUser = (socketId: string, userId: string) => {
	users[socketId] = userId;
};

const removeUser = (socketId: string) => {
	delete users[socketId];
};

export const handleSocketEvents = (socket: SocketClient, io: SocketServer) => {
	//Handle connected
	handleConnectEvent(socket, io);

	//chat
	socket.on('sendMessage', (receivedPayload) => {
		const { receiverId, content, senderContent, conversationId } =
			receivedPayload;
		console.log('[socket]: sendMessage: ' + content);
		const senderId = users[socket.id]; //Get the sender id from the users object

		console.log(
			'[sendMessage]: senderId: ' + senderId,
			'receiverId: ' + receiverId
		);

		//Send the message to the receiver
		for (const socketId in users) {
			if (users[socketId] === receiverId) {
				console.log('[sendMessage ok] Private message to: ' + receiverId);
				//Where we find the receiver socket id, we send the message
				socket.to(socket.id).to(socketId).emit('getMessage', {
					senderId,
					senderContent,
					content,
					conversationId,
				});

				// Also emit an event to refresh conversations in case it's a new conversation
				socket.to(socketId).emit('refreshConversations');
			}
		}
		// io.emit("sendMessage", `${socket.id} said ${msg}`);
	});

	//Edit message
	socket.on('editMessage', (receivedPayload) => {
		const { receiverId, messageId, content, senderContent, conversationId } =
			receivedPayload;
		console.log('[socket]: editMessage: ' + messageId);
		const senderId = users[socket.id]; //Get the sender id from the users object

		console.log(
			'[editMessage]: senderId: ' + senderId,
			'receiverId: ' + receiverId
		);

		//Send the edit message event to the receiver
		for (const socketId in users) {
			if (users[socketId] === receiverId) {
				console.log('[editMessage ok] Private message to: ' + receiverId);
				//Where we find the receiver socket id, we send the edit event
				socket.to(socket.id).to(socketId).emit('getEditMessage', {
					messageId,
					senderId,
					senderContent,
					content,
					conversationId,
					isEdited: true,
					editedAt: new Date(),
				});
			}
		}
	});

	//Delete message
	socket.on('deleteMessage', (receivedPayload) => {
		const { receiverId, messageId, conversationId } = receivedPayload;
		console.log('[socket]: deleteMessage: ' + messageId);
		const senderId = users[socket.id]; //Get the sender id from the users object

		console.log(
			'[deleteMessage]: senderId: ' + senderId,
			'receiverId: ' + receiverId
		);

		//Send the delete message event to the receiver
		for (const socketId in users) {
			if (users[socketId] === receiverId) {
				console.log('[deleteMessage ok] Private message to: ' + receiverId);
				//Where we find the receiver socket id, we send the delete event
				socket.to(socket.id).to(socketId).emit('getDeleteMessage', {
					messageId,
					senderId,
					conversationId,
					isDeleted: true,
					content: 'This message has been deleted',
					senderContent: 'This message has been deleted',
				});
			}
		}
	});

	socket.on('disconnect', () => handleDisconnectEvent(socket));
};

const handleDisconnectEvent = (socket: Socket) => {
	console.log(`user disconnect ${socket.id}`);

	//Remove the user from the users object
	removeUser(socket.id);

	console.log('[socket] users:', users);
};

const handleConnectEvent = (socket: Socket, io: SocketServer) => {
	//Verify and decode the JWT from the bearer header or auth object
	let tokenString = '';
	
	// Try to get token from Authorization header
	if (socket.handshake.headers.authorization) {
		tokenString = socket.handshake.headers.authorization.split(' ')[1] || '';
	}
	
	// Fallback to auth object (Socket.IO v4+)
	if (!tokenString && socket.handshake.auth?.token) {
		tokenString = socket.handshake.auth.token;
	}
	
	const token = verifyJWT(tokenString);

	if (token) {
		console.log(`✅ User connected: ${socket.id} | User ID: ${token.user.id}`);
		//   console.log("[handleConnectEvent]: ", token);

		//Store the user id and socket id in the users object
		addUser(socket.id, token.user.id);
		console.log('[socket] users:', users);
	} else {
		console.log('❌ [socket]: unauthorized - no valid token');

		io.emit('exception', {
			message: 'Unauthorized',
		});

		socket.disconnect();
	}
};
