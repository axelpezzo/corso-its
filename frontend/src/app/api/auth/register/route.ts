import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, passwordConfirmation } = await req.json();

  const res = await fetch(`${process.env.API_BACKEND_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 200) {
      return new NextResponse(JSON.stringify({ success: true, redirect: "/login" }), {
      status: 200,
      headers: {
      "Content-Type": "application/json",
      },
    });
  }else if (res.status === 409) {
    return new NextResponse(JSON.stringify({ success: false, error: "User already exists" }), {
      status: 409,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }else if (res.status === 500) {
    return new NextResponse(JSON.stringify({ success: false, error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new NextResponse(JSON.stringify({ success: false }), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
  
