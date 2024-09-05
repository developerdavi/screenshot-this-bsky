import axios from "axios";
import { BASE_URL } from "../constants";

export const generatePrint = async (uri: string): Promise<Uint8Array> => {
  const { data: image } = await axios.get(`${BASE_URL}/api/print`, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    params: {
      uri,
    },
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });

  return new Uint8Array(image);
};
