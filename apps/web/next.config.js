/** @type {import('next').NextConfig} */

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SOCKET_URI'];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
	console.error('❌ Missing required environment variables:');
	missingEnvVars.forEach((envVar) => {
		console.error(`   - ${envVar}`);
	});
	console.error(
		'\nPlease set these in your Netlify dashboard or .env.local file'
	);
	throw new Error(
		`Missing required environment variables: ${missingEnvVars.join(', ')}`
	);
}

const nextConfig = {
	reactStrictMode: false,
	// For Next.js 13.0.0, use experimental.transpilePackages
	experimental: {
		transpilePackages: ['ui'],
	},
	// Disable type checking during build if needed
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
};

module.exports = nextConfig;
