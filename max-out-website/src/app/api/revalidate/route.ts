import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Verify the revalidation token
    const headersList = await headers();
    const token = headersList.get("x-revalidate-token");

    if (token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { paths, tags } = await request.json();

    // Revalidate paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);

      }
    }

    // Revalidate tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);

      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {

    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}