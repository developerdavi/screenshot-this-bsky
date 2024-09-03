<h3 align="center">
  <a href="https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:u7hglg6pwujzshicmdez4hjj/bafkreify7r4nzuy7cl33nffqbu3v67qcueurvhalkqacxdm5haqo73aizq@jpeg">
  <img src="https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:u7hglg6pwujzshicmdez4hjj/bafkreify7r4nzuy7cl33nffqbu3v67qcueurvhalkqacxdm5haqo73aizq@jpeg" alt="Post telling that Bluesky lacks of a 'screenshot this' kind of bot" width="500">
  </a>
</h3>

## Getting Started

### Stack

- `next`: Used for exposing serverless functions that do all the job.
- `@atproto/api`: Official Bluesky (ATProtocol) API client.
- Vercel: Used for hosting the project, running the serverless functions and running the cron jobs.

### Setup

To run this project, you need to set the following environment variables:

- `BLUESKY_USERNAME`: Your Bluesky username
- `BLUESKY_PASSWORD`: Your Bluesky password
- `CRON_SECRET`: A secret key used to authenticate requests (optional - production usage only)

It's recommended to do so by creating a `.env.local` file in the root of the project by duplicating the `.env` file and setting the environment variables.

### Running the project

Run the development server:

```bash
yarn dev
```

Then you can start sending requests to the API.

## Routes

This project exposes the following routes:

- `GET /api/check`: Check for new mentions and reply them with the requested screenshot.
- `GET /api/print?uri={{POST_URI}}`: Generates a screenshot of a post.

## Limitations

- The image generation uses the `next/og` package that transforms HTML into a PNG image. It extends the funcionality of `satori`, which transforms HTML into SVG. It is limited in certain ways and does not support all HTML tags and CSS styles. See [docs](https://vercel.com/docs/functions/og-image-generation).
- There is no realtime checks for new mentions. The API is called every minute and checks for new mentions (see [vercel.json](/vercel.json)) by using [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs).
- Bluesky API does not expose the users' timezones, so the dates are displayed with the local timezone (usually it's UTC in the production environment).

## License

MIT © [Davi Coelho](https://github.com/developerdavi)
