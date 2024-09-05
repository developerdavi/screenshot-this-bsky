import { uploadBlob } from "../bot/services/upload-blob";
import { t } from "../dictionary/translate";
import { ImageGenerationError, NotAReplyError } from "../errors";
import { Post } from "../types";
import { getReplyData } from "../utils/get-reply-data";
import { createPost } from "./create-post";
import { generatePrint } from "./generate-print";

export const handleRequest = async (post: Post) => {
  console.info(`Post URI: ${post.uri}`);

  if (typeof post.record.reply === "undefined") {
    throw new NotAReplyError(post);
  }

  const image = await generatePrint(post.uri).catch(() => {
    throw new ImageGenerationError(post);
  });

  const blob = await uploadBlob(image);

  const recordURI = await createPost({
    text: t("success.reply", post.record.langs),
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

  return recordURI;
};
