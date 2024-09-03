import { getAgent } from "../agent";

export const getNotifications = async () => {
  const agent = await getAgent();

  const response = await agent.app.bsky.notification.listNotifications();

  return response.data;
};
