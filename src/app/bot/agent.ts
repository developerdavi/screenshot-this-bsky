import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "https://bsky.social" });

export const getAgent = async () => {
  if (!agent.did) {
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME!,
      password: process.env.BLUESKY_PASSWORD!,
    });
  }

  return agent;
};
