import { Post } from "./types";

class BaseError extends Error {
  public post: Post;

  constructor(post: Post) {
    super();
    this.name = "BaseError";
    this.post = post;
  }
}

export class NotAReplyError extends BaseError {}

export class ImageGenerationError extends BaseError {}
