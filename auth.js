import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
  header: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` },
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
      authorize: async (credentials) => {
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
});
