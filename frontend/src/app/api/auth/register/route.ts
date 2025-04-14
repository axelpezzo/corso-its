import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const res = await fetch(`${process.env.API_BACKEND_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 201) {
    return new NextResponse(JSON.stringify({ 
      success: true, 
      redirect: "/login"  // reindirizza al login dopo la registrazione
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new NextResponse(JSON.stringify({ 
    success: false,
    message: "Registration failed" 
  }), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
