import { EditForm } from "@/app/components/dashboard/ProductEditForm";
import { prisma } from "@/app/utils/db";
import { Decimal } from "@prisma/client/runtime/library";
import { notFound } from "next/navigation";
// import { unstable_noStore as noStore } from "next/cache";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!data) {
    return notFound();
  }

  return {
    ...data,
    price:
      data.price instanceof Decimal
        ? data.price.toFixed(2)
        : String(data.price), // 👈 Преобразуем Decimal в строку
  };
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
