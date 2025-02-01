// // app/api/user/route.ts (или pages/api/user.js)
// import { NextResponse } from "next/server";
// import { auth } from "@/auth"; // твоя логика аутентификации

// export async function GET() {
//   try {
//     const session = await auth(); // Получаем сессию пользователя
//     return NextResponse.json({ user: session?.user });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Ошибка при получении сессии" },
//       { status: 500 }
//     );
//   }
// }
