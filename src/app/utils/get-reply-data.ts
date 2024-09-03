import type { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import type { Post } from "../types";

export const getReplyData = (post: Post): ReplyRef => {
  return {
    parent: {
      uri: post.uri,
      cid: post.cid,
    },
    root: {
      uri: post.record.reply ? post.record.reply.root.uri : post.uri,
      cid: post.record.reply ? post.record.reply.root.cid : post.cid,
    },
  };
};
