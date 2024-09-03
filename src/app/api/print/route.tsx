/* eslint-disable @next/next/no-img-element */
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import type { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

import { getPostThread } from "@/app/bot/services/get-post-thread";
import BlueskyLogo from "@/app/components/BlueskyLogo";
import { format } from "date-fns";

export const runtime = "edge";

const fontSizes = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 32,
} as const;

const Flex: React.FC<
  PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      direction?: "row" | "column";
      align?: "start" | "center" | "end";
      justify?: "start" | "center" | "end" | "space-between";
      gap?: number;
    }
  >
> = ({ children, direction, gap, align, justify, style, ...rest }) => (
  <div
    style={{
      display: "flex",
      flexDirection: direction ?? "column",
      gap: gap ?? 20,
      alignItems: align ?? "flex-start",
      justifyContent: justify ?? "flex-start",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const Container: React.FC<PropsWithChildren> = ({ children }) => (
  <Flex
    style={{
      color: "white",
      background: "#161e26",
      width: "100%",
      height: "100%",
      padding: "50px 100px",
      gap: 25,
      fontFamily: "Noto Sans Regular",
    }}
  >
    {children}
  </Flex>
);

const Avatar: React.FC<{ src: string }> = ({ src }) => (
  <img
    alt="avatar"
    src={src}
    style={{
      width: "100px",
      height: "100px",
      borderRadius: "50%",
    }}
  />
);

const AuthorName: React.FC<PropsWithChildren> = ({ children }) => (
  <div
    style={{
      fontSize: fontSizes.md,
      fontWeight: "bolder",
      fontFamily: "Noto Sans Bold",
    }}
  >
    {children}
  </div>
);

const AuthorHandle: React.FC<PropsWithChildren> = ({ children }) => (
  <div style={{ fontSize: fontSizes.sm, color: "#aeb6bf" }}>{children}</div>
);

const Author: React.FC<{ image: string; name: string; handle: string }> = ({
  image,
  name,
  handle,
}) => (
  <Flex direction="row" align="center">
    <Avatar src={image} />
    <Flex gap={0} justify="center">
      <AuthorName>{name || handle}</AuthorName>
      <AuthorHandle>{`@${handle}`}</AuthorHandle>
    </Flex>
  </Flex>
);

const Thumbnail: React.FC<{ src: string }> = ({ src }) => (
  <img
    alt="thumbnail"
    src={src}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "10px",
    }}
  />
);

const Text: React.FC<
  PropsWithChildren<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >
> = ({ children, ...rest }) => (
  <div style={{ fontSize: fontSizes.lg, color: "white" }} {...rest}>
    {children}
  </div>
);

export const GET = async (request: NextRequest) => {
  const uri = request.nextUrl.searchParams.get("uri");

  if (!uri) {
    return Response.json({ error: "Invalid URI" }, { status: 400 });
  }

  const notoSansRegular = await fetch(
    new URL(
      "../../assets/fonts/NotoSans-Regular.ttf",
      import.meta.url
    ).toString()
  ).then((res) => res.arrayBuffer());
  const notoSansBold = await fetch(
    new URL("../../assets/fonts/NotoSans-Bold.ttf", import.meta.url).toString()
  ).then((res) => res.arrayBuffer());

  const thread = await getPostThread(uri);

  const parent = thread.parent as any;

  const thumbnail =
    parent.post?.embed?.$type === "app.bsky.embed.images#view"
      ? parent.post.embed?.images?.[0]?.thumb
      : undefined;

  const formattedDate = format(new Date(parent.post.record.createdAt), "Pp");

  return new ImageResponse(
    (
      <Container>
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          gap={10}
          style={{
            width: "100%",
          }}
        >
          <Author
            image={parent.post.author.avatar}
            name={parent.post.author.displayName}
            handle={parent.post.author.handle}
          />
          <BlueskyLogo width={100} />
        </Flex>
        <Flex>
          <Text>{parent.post.record.text}</Text>
        </Flex>
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            flex: "1 1 auto",
            width: "100%",
          }}
        >
          {thumbnail && <Thumbnail src={thumbnail} />}
        </div>
        <Text
          style={{
            fontSize: fontSizes.xs,
            color: "#aeb6bf",
          }}
        >
          {formattedDate}
        </Text>
      </Container>
    ),
    {
      width: 800,
      height: !!thumbnail ? 1000 : 800,
      fonts: [
        {
          name: "Noto Sans Regular",
          data: notoSansRegular,
          style: "normal",
        },
        {
          name: "Noto Sans Bold",
          data: notoSansBold,
          style: "normal",
        },
      ],
    }
  );
};
