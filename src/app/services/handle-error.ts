import { Notification } from "@atproto/api/dist/client/types/app/bsky/notification/listNotifications";
import { ImageGenerationError, NotAReplyError } from "../errors";
import { getReplyData } from "../utils/get-reply-data";
import { createPost } from "./create-post";
import { Post, Record } from "../types";
import { sendMessage } from "../bot/services/send-message";
import { t } from "../dictionary/translate";

export const handleError = async (
  error: unknown,
  notification: Notification
) => {
  const reply = (post: Post, text: string) =>
    createPost({
      text: `[Error] ${text}`,
      reply: getReplyData(post),
    });

  console.error("Error caught:");
  console.error(error);

  try {
    switch (true) {
      case error instanceof NotAReplyError:
        await reply(error.post, t("error.notAReply", error.post.record.langs));
        break;
      case error instanceof ImageGenerationError:
        await reply(
          error.post,
          t("error.imageGeneration", error.post.record.langs)
        );
        break;
      default:
        await sendMessage(
          notification.author.did,
          t("error.unknown", (notification.record as Record).langs, {
            error: (error as Error).message,
          })
        );
    }
  } catch (error) {
    console.error("Error while handling error:");
    console.error(error);
  }
};
