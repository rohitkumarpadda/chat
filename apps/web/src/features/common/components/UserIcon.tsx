interface IUserIconProps {
	size?: number;
	color?: string;
	className?: string;
}

export const UserIcon = ({
	size = 24,
	color = '#0a82cd',
	className,
}: IUserIconProps) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill='none'
			stroke={color}
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
		>
			<circle cx='12' cy='12' r='10' />
			<circle cx='12' cy='10' r='3' />
			<path d='M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662' />
		</svg>
	);
};
