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
import { validateCronSecret } from "@/app/utils/validate-cron-secret";

export const runtime = "edge";

const fontSizes = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 32,
} as const;

const sizes = {
  CONTAINER_GAP: 25,
  CONTAINER_PADDING_VERTICAL: 50,
  CONTAINER_PADDING_HORIZONTAL: 100,
  AVATAR_SIZE: 100,
  LINE_HEIGHT: fontSizes.lg * 1.2,
  IMAGE: 350,
} as const;

const AVERAGE_CHARACTERS_PER_LINE = 35;

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
    justify="center"
    style={{
      color: "white",
      background: "#161e26",
      width: "100%",
      height: "100%",
      padding: `${sizes.CONTAINER_PADDING_VERTICAL}px ${sizes.CONTAINER_PADDING_HORIZONTAL}px`,
      gap: sizes.CONTAINER_GAP,
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
      width: `${sizes.AVATAR_SIZE}px`,
      height: `${sizes.AVATAR_SIZE}px`,
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

const Content: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n").map((line, index) => {
    return (
      <Text
        key={index}
        style={{
          fontSize: fontSizes.lg,
          minHeight: sizes.LINE_HEIGHT,
          lineHeight: `${sizes.LINE_HEIGHT}px`,
          color: "white",
          display: "flex",
          flexWrap: "wrap",
          columnGap: 8,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {line.split(/\s+/).map((word, index) => {
          return (
            <span
              key={index}
              style={{
                ...(/^(@|#).*/.test(word) && {
                  color: "#208bfe",
                }),
              }}
            >
              {word}
            </span>
          );
        })}
      </Text>
    );
  });

  return (
    <Flex
      style={{
        maxHeight: "100%",
        width: "100%",
        maxWidth: "100%",
        gap: 0,
      }}
    >
      {lines}
    </Flex>
  );
};

export const GET = async (request: NextRequest) => {
  try {
    validateCronSecret(request);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 401 });
  }

  const uri = request.nextUrl.searchParams.get("uri");
  const debug = request.nextUrl.searchParams.get("debug");

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
  const notoSansSymbols = await fetch(
    new URL(
      "../../assets/fonts/NotoSans-Symbols.ttf",
      import.meta.url
    ).toString()
  ).then((res) => res.arrayBuffer());
  const notoSansSymbols2 = await fetch(
    new URL(
      "../../assets/fonts/NotoSans-Symbols2.ttf",
      import.meta.url
    ).toString()
  ).then((res) => res.arrayBuffer());

  const thread = await getPostThread(uri);

  const parent = thread.parent as any;

  const thumbnail =
    parent.post?.embed?.$type === "app.bsky.embed.images#view"
      ? parent.post.embed?.images?.[0]?.thumb
      : undefined;

  const formattedDate = format(
    new Date(parent.post.record.createdAt),
    "dd MMM '•' HH:mm '('OOOO')'"
  );

  const text = parent.post.record.text as string;

  const sanitizedTextLength = text.replace(/\n/g, "").length;
  const minimumLines = text.split("\n").length;

  const textHeight =
    Math.ceil(
      minimumLines + sanitizedTextLength / AVERAGE_CHARACTERS_PER_LINE
    ) * sizes.LINE_HEIGHT;

  const totalHeight =
    textHeight +
    sizes.CONTAINER_PADDING_VERTICAL * 2 +
    sizes.AVATAR_SIZE +
    sizes.CONTAINER_GAP * (!!thumbnail ? 3 : 2) +
    sizes.LINE_HEIGHT +
    (!!thumbnail ? sizes.IMAGE : 0);

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
          <BlueskyLogo width={80} />
        </Flex>
        <Flex>
          <Content text={text} />
        </Flex>
        {thumbnail && (
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              flex: "1 1 auto",
              width: "100%",
            }}
          >
            <Thumbnail src={thumbnail} />
          </div>
        )}
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
      height: totalHeight,
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
        {
          name: "Noto Sans Symbols",
          data: notoSansSymbols,
          style: "normal",
        },
        {
          name: "Noto Sans Symbols2",
          data: notoSansSymbols2,
          style: "normal",
        },
      ],
      debug: debug === "true",
    }
  );
};
