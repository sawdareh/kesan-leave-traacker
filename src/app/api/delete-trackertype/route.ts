// app/api/delete-tracker/route.ts

import { deleteTrackerType } from "@/lib/queries/deleteTrackerType";

export async function POST(req: Request) {
  const { id } = await req.json();
  await deleteTrackerType(id);
  return new Response("Deleted", { status: 200 });
}
