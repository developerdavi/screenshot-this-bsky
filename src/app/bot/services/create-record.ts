import { AppBskyFeedPost } from "@atproto/api";
import { getAgent } from "../agent";

export const createRecord = async (record: AppBskyFeedPost.Record) => {
  const agent = await getAgent();

  const response = await agent.app.bsky.feed.post.create(
    {
      repo: agent.did,
    },
    record
  );

  return response.uri;
};
