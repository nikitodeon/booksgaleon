import { prisma } from "@/app/utils/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
