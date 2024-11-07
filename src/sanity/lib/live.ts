import "server-only";
import { defineLive } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_PREVIEW_SECRET;
if (!token) {
  throw new Error("SANITY_API_TOKEN is Missing");
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    revalidate: 0,
  },
});
