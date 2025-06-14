import { client } from "./client.gen";
import * as sdk from "./sdk.gen";

export default sdk;
export * from "./types.gen";

client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
});
