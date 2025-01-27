import { EditForm } from "@/app/components/dashboard/CategoryEditForm";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
// import { unstable_noStore as noStore } from "next/cache";

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
  params: { id: string };
}) {
  //   noStore();
  const data = await getData(params.id);
  return <EditForm data={data} />;
}
