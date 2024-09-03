import { getAgent } from "../agent";

export const getUnreadNotificationsCount = async () => {
  const agent = await getAgent();

  const response = await agent.app.bsky.notification.getUnreadCount();

  return response.data;
};
