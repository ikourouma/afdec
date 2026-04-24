/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/fund_interests',
        destination: '/diaspora-impact-fund/interest',
        permanent: true,
      },
      {
        source: '/fund%20interests',
        destination: '/diaspora-impact-fund/interest',
        permanent: true,
      },
    ];
  },
  output: 'standalone', 
  // If you are using Hostinger Shared Hosting (not VPS), you might need:
  // output: 'export', 
};

export default nextConfig;
