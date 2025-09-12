export const Logo = ({ size = 40 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox='-6.4 -6.4 76.80 76.80'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g>
				<rect
					x='-6.4'
					y='-6.4'
					width='76.80'
					height='76.80'
					rx='38.4'
					fill='#3dc4e6'
				/>
			</g>
			<g>
				<circle fill='#44b2ee' cx='32' cy='32' r='32' />
			</g>
			<g style={{ opacity: 0.2 }}>
				<path
					fill='#231F20'
					d='M52,32c0-9.9-9-18-20-18s-20,8.1-20,18c0,9.6,8.3,17.4,18.8,17.9C31.5,53.6,32,56,32,56s5-3,9.6-8.2 C47.8,44.7,52,38.8,52,32z'
				/>
			</g>
			<g>
				<path
					fill='#ffffff'
					d='M49,28.8C49,43.8,32,54,32,54s-9.4-42,0-42S49,19.5,49,28.8z'
				/>
			</g>
			<g>
				<ellipse fill='#ffffff' cx='32' cy='30' rx='20' ry='18' />
			</g>
			<g>
				<circle fill='#000000' cx='32' cy='30' r='2' />
			</g>
			<g>
				<circle fill='#000000' cx='40' cy='30' r='2' />
			</g>
			<g>
				<circle fill='#000000' cx='24' cy='30' r='2' />
			</g>
		</svg>
	);
};
