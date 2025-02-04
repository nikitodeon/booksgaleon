import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") || "";

    console.log("🔍 Поисковый запрос:", query); // Лог запроса

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    });

    console.log("✅ Найденные продукты:", products); // Лог результатов

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Ошибка в API /search:", error); // Вывод ошибки в консоль
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
