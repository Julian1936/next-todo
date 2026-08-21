import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT!;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN!;

async function hygraphRequest(query: string, variables: Record<string, unknown>) {
  const res = await fetch(HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = session.user.id;
  const { todoTitle, todoDetails, todoBy } = await req.json();

  if (!todoTitle || typeof todoTitle !== "string") {
    return NextResponse.json({ error: "todoTitle is required" }, { status: 400 });
  }

  try {
    const createData = await hygraphRequest(
      `mutation CreateTodo($todoTitle: String!, $todoDetails: String!, $todoBy: DateTime!, $userId: ID!) {
            createTodo(data: { 
              todoTitle: $todoTitle, 
              todoDetails: $todoDetails,
              todoBy: $todoBy,
              todoUser: { connect: {id: $userId}} }){
                id
            }
        }`,
      { todoTitle, todoDetails: todoDetails ?? null, todoBy, userId },
    );

    const id = createData.createTodo.id;

    try {
      await hygraphRequest(
        `mutation PublishTodo($id: ID!) {
            publishTodo(where: { id: $id }, to: PUBLISHED){
                id
            }
        }`,
        { id },
      );
    } catch (publishErr) {
      await hygraphRequest(
        `mutation DeleteTodo($id: ID!) {
          deleteTodo(where: {id: $id}) {
            id
          }
        }`,
        { id },
      ).catch((deleteErr) => {
        console.error("Failed to rollback orphaned draft", id, deleteErr);
      });
      throw publishErr;
    }

    return NextResponse.json(
      { id, todoTitle, todoDetails },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const data = await hygraphRequest(
      `query GetTodos($userId: ID!) {
          todos(
            where: { todoUser: { id: $userId } }
            stage: PUBLISHED
            orderBy: createdAt_DESC
          ) {
            id
            todoTitle
            todoDetails
            todoBy
            createdAt
          }
        }`,
      { userId },
    );

    return NextResponse.json(data.todos, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}
