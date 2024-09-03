import { getAgent } from "../agent";

export const sendMessage = async (targetDid: string, text: string) => {
  const agent = await getAgent();

  const {
    data: { convo },
  } = await agent.chat.bsky.convo.getConvoForMembers({
    members: [agent.did!, targetDid],
  });

  const response = await agent.chat.bsky.convo.sendMessage({
    convoId: convo.id,
    message: {
      text,
    },
  });

  return response.data;
};
