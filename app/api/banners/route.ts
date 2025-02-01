// /app/api/banners/route.ts (если используете app directory)
import { prisma } from "@/app/utils/db";

export async function GET() {
  const data = await prisma.banner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return new Response(JSON.stringify(data));
}
