import { AuthConfig } from "convex/server";

export default {
    providers: [
        {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://clerk.tanmaymirgal.dev/v1/oauth_callback",
            applicationID: "convex",
        },
    ],
} satisfies AuthConfig;
