import type { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import type { Record as BskyFeedPostRecord } from "@atproto/api/dist/client/types/app/bsky/feed/post";

export type Record = BskyFeedPostRecord;
export type Post = PostView & { record: Record };
