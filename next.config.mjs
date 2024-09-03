/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "https://github.com/developerdavi/screenshot-this-bsky",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
