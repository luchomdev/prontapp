/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 's3.us-east-2.amazonaws.com'
          },
          {
            protocol: 'https',
            hostname: 'api.prontapp.co'
          },
          {
            protocol: 'http',
            hostname: 'localhost'
          },
          {
            protocol: 'https',
            hostname: 'www.facebook.com'
          },
          {
            protocol: 'https',
            hostname: 'facebook.com'
          },
        ],
      },
};

export default nextConfig;
