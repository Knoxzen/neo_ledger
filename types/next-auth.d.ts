import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      loginDate?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    loginDate?: string;
  }
}
