import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Путь к твоей логике аутентификации

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({ user: session?.user });
  } catch (error) {
    console.error("Ошибка при получении сессии:", error);
    return NextResponse.json(
      {
        error: "Ошибка при получении сессии",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
