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
          return { id: newUser.id, email };
        }

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
