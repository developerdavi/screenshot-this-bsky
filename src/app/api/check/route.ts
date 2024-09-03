import { createRecord } from "@/app/bot/services/create-record";
import { getNotifications } from "@/app/bot/services/get-notifications";
import { getPostThread } from "@/app/bot/services/get-post-thread";
import { updateSeen } from "@/app/bot/services/updateSeen";
import { uploadBlob } from "@/app/bot/services/upload-blob";
import { BASE_URL } from "@/app/constants";
import axios, { AxiosError } from "axios";

// disable static page generation
export const revalidate = 0;

export const GET = async (_request: Request) => {
  const { notifications } = await getNotifications();

  const seenAt = new Date().toISOString();

  for (const notification of notifications.filter((n) => !n.isRead)) {
    try {
      const thread = await getPostThread(notification.uri);
      const post = thread.post as any;
      const parentData = {
        uri: post.uri,
        cid: post.cid,
      };
      const { data: image } = await axios.get(`${BASE_URL}/api/print`, {
        params: {
          uri: post.uri,
        },
        responseType: "arraybuffer",
        responseEncoding: "binary",
      });
      const blob = await uploadBlob(image);
      await createRecord({
        text: "Here is a screenshot of this post:",
        createdAt: new Date().toISOString(),
        embed: {
          $type: "app.bsky.embed.images",
          images: [
            {
              alt: "A screenshot from this post",
              image: blob,
            },
          ],
        },
        reply: {
          parent: parentData,
          root: post.record.reply
            ? {
                uri: post.record.reply.root.uri,
                cid: post.record.reply.root.cid,
              }
            : parentData,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  await updateSeen(seenAt);

  return Response.json(notifications);
};
