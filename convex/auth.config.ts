import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://clerk.tanmaymirgal.dev/v1/oauth_callback",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
