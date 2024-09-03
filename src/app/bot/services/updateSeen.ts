import { getAgent } from "../agent";

export const updateSeen = async (seenAt: string) => {
  const agent = await getAgent();

  const response = await agent.app.bsky.notification.updateSeen({
    seenAt,
  });

  return response.success;
};
