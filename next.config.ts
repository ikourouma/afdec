import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
