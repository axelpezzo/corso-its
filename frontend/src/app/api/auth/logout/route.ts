import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
    // Remove the auth cookie
    (await cookies()).set('sessionId', '')
  
  return new NextResponse(JSON.stringify({ success: true, redirect: "/login" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}