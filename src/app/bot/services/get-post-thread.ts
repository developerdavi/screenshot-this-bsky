import { getAgent } from "../agent";

export const getPostThread = async (uri: string) => {
  const agent = await getAgent();

  const response = await agent.app.bsky.feed.getPostThread({
    uri,
  });

  return response.data.thread;
};
