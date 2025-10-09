import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '~/features/auth';
import { SocketContext } from './SocketContext';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [connected, setConnected] = useState(false);
	const { accessToken } = useAuth();

	useEffect(() => {
		// Only create socket if we have an access token
		if (!accessToken) {
			// If no token and socket exists, disconnect it
			if (socket) {
				console.log('No access token, disconnecting socket...');
				socket.disconnect();
				setSocket(null);
				setConnected(false);
			}
			return;
		}

		// Create socket with auth token
		console.log('Creating socket with auth token...');
		console.log(
			'Token length:',
			accessToken.length,
			'Token preview:',
			accessToken.substring(0, 20) + '...'
		);

		const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URI!, {
			auth: {
				token: accessToken,
			},
			extraHeaders: {
				Authorization: `Bearer ${accessToken}`,
			},
			transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 10000, // 10 second connection timeout
		});

		newSocket.on('connect', () => {
			console.log('✅ Socket connected:', newSocket.id);
			console.log('Transport:', newSocket.io.engine.transport.name);
			setConnected(true);
		});

		newSocket.on('disconnect', (reason) => {
			console.log('❌ Socket disconnected. Reason:', reason);
			if (reason === 'io server disconnect') {
				console.log(
					'⚠️ Server disconnected the socket - likely authentication failed'
				);
			}
			setConnected(false);
		});

		newSocket.on('connect_error', (error) => {
			console.error('❌ Socket connection error:', error.message);
		});

		newSocket.on('error', (error) => {
			console.error('❌ Socket error:', error);
		});

		newSocket.on('exception', (data) => {
			console.error('❌ Socket exception:', data);
		});

		setSocket(newSocket);

		return () => {
			console.log('Cleaning up socket...');
			newSocket.off('connect');
			newSocket.off('disconnect');
			newSocket.off('error');
			newSocket.off('exception');
			newSocket.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken]);

	return (
		<SocketContext.Provider value={{ socket, connected }}>
			{children}
		</SocketContext.Provider>
	);
};
