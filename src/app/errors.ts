import { Post } from "./types";

class BaseError extends Error {
  public post: Post;

  constructor(post: Post) {
    super();
    this.name = "BaseError";
    this.post = post;
  }
}

export class NotAReplyError extends BaseError {
  name = "NotAReplyError";
}

export class ImageGenerationError extends BaseError {
  name = "ImageGenerationError";
}
