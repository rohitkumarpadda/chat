import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<link
					href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,700&display=swap'
					rel='stylesheet'
				/>
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<link rel='icon' type='image/png' href='/favicon.png' />
				<link rel='apple-touch-icon' href='/favicon.png' />
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
