import { NextResponse } from "next/server";
import type { CopilotResponse } from "@/types";
import { generateCopilotResponse } from "@/lib/copilot";

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes || typeof notes !== "string") {
      return NextResponse.json({ error: "Notes are required" }, { status: 400 });
    }

    const result = generateCopilotResponse(notes);
    return NextResponse.json(result satisfies CopilotResponse);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
