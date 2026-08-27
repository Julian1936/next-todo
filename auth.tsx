import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import { GraphQLClient, gql } from "graphql-request";

const hygraphEndpoint = process.env.HYGRAPH_ENDPOINT;
const hygraphToken = process.env.HYGRAPH_TOKEN;

if (!hygraphEndpoint || !hygraphToken) {
  throw new Error("Missing HYGRAPH_ENDPOINT or HYGRAPH_TOKEN environment variables");
}

const client = new GraphQLClient(hygraphEndpoint, {
  headers: { Authorization: `Bearer ${hygraphToken}` },
});

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    user: todoUser(where: { email: $email }, stage: DRAFT) {
      id
      password
      firstName
      lastName
    }
  }
`;

const CreateTodoUserByEmail = gql`
  mutation CreateTodoUserByEmail($email: String!, $password: String!) {
    newUser: createTodoUser(data: { email: $email, password: $password }) {
      id
    }
  }
`;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Credentials are potentially undefined/unknown
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") {
          return null;
        }
        const { email, password } = credentials;
        const { user } = await client.request(GetUserByEmail, { email });

        if (!user) {
          const { newUser } = await client.request(CreateTodoUserByEmail, {
            email,
            password: await hash(password, 12),
          });
          return { id: newUser.id, email, firstName: null, lastName: null };
        }

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, email, firstName: user.firstName ?? null, lastName: user.lastName ?? null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }

      if (trigger === "update" && session) {
        token.firstName = session.firstName;
        token.lastName = session.lastName;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).firstName = token.firstName as string | null;
        (session.user as any).lastName = token.lastName as string | null;
      }
      return session;
    },
  },
});
