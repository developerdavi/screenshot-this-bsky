import { responses } from "./responses";
import { Languages } from "./types";

export const t = (
  key: keyof typeof responses,
  languages?: (string | Languages)[],
  params?: Record<string, string>
) => {
  const language =
    (languages?.find((l) => Object.values<string>(Languages).includes(l)) as
      | Languages
      | undefined) ?? Languages.EN;

  return responses[key][language].replace(/\{\{(\w+)\}\}/g, (_, p1) => {
    return params?.[p1] || "";
  });
};
