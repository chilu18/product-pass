import { NextResponse } from "next/server";
import type { CopilotResponse } from "@/types";
import { generateCopilotResponseAsync } from "@/lib/copilot";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notes = body?.notes;
    const brandPrefix =
      typeof body?.brandPrefix === "string" && body.brandPrefix.trim()
        ? body.brandPrefix.trim().toUpperCase().slice(0, 4)
        : "PP";

    if (!notes || typeof notes !== "string") {
      return NextResponse.json({ error: "Notes are required" }, { status: 400 });
    }

    const result = await generateCopilotResponseAsync(notes, brandPrefix);
    return NextResponse.json(result satisfies CopilotResponse);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
