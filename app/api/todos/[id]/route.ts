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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await hygraphRequest(
      `query GetTodoOwner($id: ID!){
        todo(where: { id: $id}) {
            id
                todoUser {
                    id
                }
            }
        }`,
      { id },
    );

    if (!existing.todo || existing.todo.todoUser?.id !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await hygraphRequest(
      `mutation DeleteTodo($id: ID!) {
            deleteTodo(where: { id: $id }) {
                id
            }
        }`,
      { id },
    );

    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
