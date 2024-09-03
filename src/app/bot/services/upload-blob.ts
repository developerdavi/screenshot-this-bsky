import { getAgent } from "../agent";

export const uploadBlob = async (blob: string | Uint8Array | Blob) => {
  const agent = await getAgent();

  const response = await agent.uploadBlob(blob);

  return response.data.blob;
};
