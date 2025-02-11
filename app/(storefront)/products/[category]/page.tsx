import { ProductCard } from "@/app/components/storefront/ProductCard";
import { prisma } from "@/app/utils/db";
import { notFound, redirect } from "next/navigation";

async function getData(categorySlug: string) {
  if (categorySlug === "vse-zhanry") {
    redirect("/");
  }
  if (categorySlug === "bestsellery") {
    const data = await prisma.product.findMany({
      where: { status: "published", isFeatured: true },
      select: {
        name: true,
        images: true,
        price: true,
        id: true,
        description: true,
      },
    });

    return {
      title: "Бестселлеры",

      data: data.map((item) => ({ ...item, price: item.price.toString() })),
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },

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

    data: data.map((item) => ({ ...item, price: item.price.toString() })),
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryData = await getData(params.category);

  if (!categoryData) {
    return notFound();
  }

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5 custom">
        {categoryData.title}
      </h1>

      <div className=" grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {categoryData.data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
