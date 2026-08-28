import { NextRequest, NextResponse } from "next/server";
import { GraphQLClient, gql } from "graphql-request";
import { auth } from "@/auth";

const client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT!, {
  headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}` },
});

const UpdateTodoUser = gql`
  mutation UpdateTodoUser($id: ID!, $firstName: String!, $lastName: String!) {
    updateTodoUser(where: { id: $id }, data: { firstName: $firstName, lastName: $lastName }) {
      id
      firstName
      lastName
    }
  }
`;

const PublishTodoUser = gql`
  mutation PublishTodoUser($id: ID!) {
    publishTodoUser(where: { id: $id }, to: PUBLISHED) {
      id
      stage
    }
  }
`;

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { firstName, lastName } = await req.json();

  if (typeof firstName !== "string" || !firstName.trim() || typeof lastName !== "string" || !lastName.trim()) {
    return NextResponse.json({ error: "First and last name required" }, { status: 400 });
  }

  const { updateTodoUser } = await client.request(UpdateTodoUser, {
    id: session.user.id,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  });

  await client.request(PublishTodoUser, { id: session.user.id });

  return NextResponse.json({ user: updateTodoUser });
}
