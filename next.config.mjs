/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: `https://bsky.app/profile/${process.env.BLUESKY_USERNAME}`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
