import { ProductCard } from "@/app/components/storefront/ProductCard";
import { prisma } from "@/app/utils/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(categorySlug: string) {
  // Список "красивых" категорий и их названий
  //   const categoryMap: Record<string, string> = {
  //     bestsellery: "Бестселлеры",
  //     klassika: "Классика",
  //     fantastika: "Фантастика",
  //     detektivy: "Детективы",
  //     nauchnye: "Научные",
  //     priklyucheniya: "Приключения",
  //     poeziya: "Поэзия",
  //     "populyarnye-knigi": "Популярные книги",
  //     "dlya-detey-i-podrostkov": "Для детей и подростков",
  //   };

  //   if (categoryMap.hasOwnProperty(productSlug)) {
  // Ищем категорию по названию
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    //   { title: categoryMap[productSlug] },
    select: { id: true, title: true },
  });

  if (!category) return notFound();

  const data = await prisma.product.findMany({
    where: { status: "published", categoryId: category.id },
    select: {
      name: true,
      images: true,
      price: true,
      id: true,
      description: true,
    },
  });

  return {
    title: category.title,
    //    categoryMap[productCategory],
    data: data.map((item) => ({ ...item, price: item.price.toString() })),
  };
  //   } else {
  //     // Проверяем, передан ли ID категории (например, "64f8e3b2d6a3")
  //     const category = await prisma.category.findUnique({
  //       where: { slug: categorySlug },
  //       select: { title: true, id: true },
  //     });

  //     if (!category) return notFound();

  //     const data = await prisma.product.findMany({
  //       where: { status: "published", categoryId: category.id },
  //       select: {
  //         name: true,
  //         images: true,
  //         price: true,
  //         id: true,
  //         description: true,
  //       },
  //     });

  //     return {
  //       title: category.title, // Используем название категории из БД
  //       data: data.map((item) => ({ ...item, price: item.price.toString() })),
  //     };
  //   }
}

export default async function CategoriesPage({
  params,
}: {
  params: { category: string };
}) {
  noStore();

  const categoryData = await getData(params.category);

  if (!categoryData) {
    return notFound();
  }

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5 font-moondance">
        {categoryData.title}
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryData.data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
