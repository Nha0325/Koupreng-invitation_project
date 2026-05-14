import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Demo credentials - in production, validate against your Spring Boot backend
    if (
      email === "admin@koupreng.com" &&
      password === "password123"
    ) {
      return NextResponse.json({
        token: "demo-jwt-token-" + Date.now(),
        user: {
          id: "1",
          email: "admin@koupreng.com",
          name: "Admin User",
          role: "SUPER_ADMIN",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
