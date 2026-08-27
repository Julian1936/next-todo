// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string | null;
    lastName?: string | null;
  }

  interface Session {
    user: {
      firstName?: string | null;
      lastName?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string | null;
    lastName?: string | null;
  }
}
