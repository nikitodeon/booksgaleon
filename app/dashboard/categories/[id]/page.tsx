import { EditForm } from "@/app/components/dashboard/CategoryEditForm";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";

async function getData(categoryId: string) {
  const data = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);
  return <EditForm data={data} />;
}
