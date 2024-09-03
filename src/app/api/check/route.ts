import { getNotifications } from "@/app/bot/services/get-notifications";
import { getPostThread } from "@/app/bot/services/get-post-thread";
import { getUnreadNotificationsCount } from "@/app/bot/services/get-unread-notifications-count";
import { updateSeen } from "@/app/bot/services/updateSeen";
import { uploadBlob } from "@/app/bot/services/upload-blob";
import { BASE_URL } from "@/app/constants";
import { ImageGenerationError, NotAReplyError } from "@/app/errors";
import { createPost } from "@/app/services/create-post";
import { handleError } from "@/app/services/handle-error";
import { Post } from "@/app/types";
import { getReplyData } from "@/app/utils/get-reply-data";
import { validateCronSecret } from "@/app/utils/validate-cron-secret";
import axios from "axios";
import { NextRequest } from "next/server";

// disable static page generation
export const revalidate = 0;

interface Successful {
  notificationURI: string;
  recordURI: string;
}

interface Failed extends Omit<Successful, "recordURI"> {
  error: string;
}

export const GET = async (request: NextRequest) => {
  try {
    validateCronSecret(request);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 401 });
  }

  const { count } = await getUnreadNotificationsCount();

  if (count === 0) {
    console.info("No new notifications");
    return Response.json([]);
  }

  const data = await getNotifications();

  const notifications = data.notifications.filter(
    (n) => !n.isRead && n.reason === "mention"
  );

  if (notifications.length === 0) {
    console.info("No new mentions");
    return Response.json([]);
  }

  const success: Successful[] = [];
  const errors: Failed[] = [];

  console.info(`Found ${notifications.length} new mentions`);

  const seenAt = new Date().toISOString();

  for (const notification of notifications) {
    try {
      console.info(`Processing request from @${notification.author.handle}`);
      const thread = await getPostThread(notification.uri);
      const post = thread.post as Post;
      console.info(`Post URI: ${post.uri}`);
      if (typeof post.record.reply === "undefined") {
        throw new NotAReplyError(post);
      }
      const { data: image } = await axios
        .get(`${BASE_URL}/api/print`, {
          params: {
            uri: post.uri,
          },
          responseType: "arraybuffer",
          responseEncoding: "binary",
        })
        .catch(() => {
          throw new ImageGenerationError(post);
        });
      const blob = await uploadBlob(image);
      const recordURI = await createPost({
        text: "Here is a screenshot of this post:",
        embed: {
          $type: "app.bsky.embed.images",
          images: [
            {
              alt: "A screenshot from this post",
              image: blob,
            },
          ],
        },
        reply: getReplyData(post),
      });
      success.push({ notificationURI: notification.uri, recordURI });
      console.info(`Created record for ${notification.uri}: ${recordURI}`);
    } catch (error) {
      errors.push({
        notificationURI: notification.uri,
        error: (error as Error).message,
      });
      console.error(
        `Error processing request from @${notification.author.handle}`
      );
      await handleError(error, notification);
    }
  }

  await updateSeen(seenAt);

  return Response.json({
    success,
    errors,
  });
};
