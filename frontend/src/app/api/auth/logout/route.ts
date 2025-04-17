import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
  cookieStore.delete("sessionId");
  
  return new NextResponse(JSON.stringify({ success: true, redirect: "/login" }), {
    status: 200,
  });
}