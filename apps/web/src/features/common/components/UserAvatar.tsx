import { useMantineTheme } from '@mantine/core';
import { IUserDoc, JWTUser, IUser, ISearchItem } from 'interfaces';
import { useState, useEffect } from 'react';
import { textToColorScheme } from '~/utils/ui';
import { UserIcon } from './UserIcon';

interface IUserAvatarProps {
	user?: JWTUser | IUserDoc | IUser | ISearchItem;
	size?: number;
}

export const UserAvatar = ({ user, size = 32 }: IUserAvatarProps) => {
	const theme = useMantineTheme();
	const [color, setColor] = useState(theme.colors.blue[5]);

	useEffect(() => {
		if (user?.username) {
			setColor(theme.colors[textToColorScheme(user.username)][4]);
		} else {
			setColor(theme.colors.blue[5]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.username, theme]);

	// Use the UserIcon as the default avatar with user-specific coloring
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor:
					theme.colorScheme === 'dark'
						? theme.colors.dark[6]
						: theme.colors.gray[1],
				border: `2px solid ${
					theme.colorScheme === 'dark'
						? theme.colors.dark[4]
						: theme.colors.gray[3]
				}`,
				transition: 'all 0.2s ease',
			}}
		>
			<UserIcon size={size * 0.65} color={color} />
		</div>
	);
};
