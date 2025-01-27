import { prisma } from "@/app/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany();

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
